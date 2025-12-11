import {
	Button,
	chakra,
	FormControl,
	FormLabel,
	GridItem,
	Heading,
	Image,
	Input,
	Spinner,
	Text,
} from '@chakra-ui/react'
import { narrow } from 'narrow-minded'
import { ChangeEvent } from 'preact/compat'
import { useMemo, useState } from 'preact/hooks'

import { useLayout } from '/src/features/layout/useLayout'
import { selectPullStatus } from '/src/features/rss/slice'
import { EpisodeRow } from '/src/features/subscriptions/EpisodeRow'
import {
	getPubDate,
	Subscription,
	SubscriptionItem,
} from '/src/features/subscriptions/models'
import { useAppSelector } from '/src/store'
import { EpisodesGrid, HStack, PageGrid, PageStack, VStack } from '/src/ui'
import { CodeBlock } from '/src/ui/CodeBlock'
import { Chunker, createThrottler, DevOnly, useChunker } from '/src/utils'
import { fromIso } from '/src/utils/datetime'

import { selectSubscriptionWithItems } from './slice'

const filterCommitThrottler = createThrottler(400, { trailing: true })

type Filters = {
	text?: string
	after?: string
	before?: string
}

type FilterContext = {
	items: readonly SubscriptionItem[]
	filters: Filters
}

type FilterFunc = (input: FilterContext) => FilterContext

const applyFilterDates: FilterFunc = input => {
	const { items, filters } = input
	if (!narrow({ after: 'string', before: 'string' }, filters)) {
		return input
	}

	const earliestIndex = items.findIndex(
		item => fromIso(filters.after) <= getPubDate(item),
	)
	const latestIndex = items.findIndex(
		item => getPubDate(item) <= fromIso(filters.before),
	)

	const itemsOut = items.slice(earliestIndex, latestIndex + 1)

	return { items: itemsOut, filters }
}

const makePattern = (
	maybePattern: string,
): { test: (s: string) => boolean } => {
	try {
		if (maybePattern.startsWith('/'))
			return new RegExp(maybePattern.substring(1), 'iv')
	} catch {
		//
	}
	return {
		test: (s: string) => s.toLowerCase().includes(maybePattern.toLowerCase()),
	}
}

const applyFilterText: FilterFunc = input => {
	const { items, filters } = input
	if (!(narrow({ text: 'string' }, filters) && filters.text.length > 1)) {
		return input
	}
	const pattern = makePattern(filters.text)
	const itemsOut = items.filter(
		it =>
			pattern.test(it.title) ||
			(it.contentSnippet && pattern.test(it.contentSnippet)),
	)
	return { items: itemsOut, filters }
}

const applyFilters: FilterFunc = (input: FilterContext) =>
	applyFilterText(applyFilterDates(input))

export const SubscriptionDetailsPage = () => {
	const { ensureData } = useLayout()

	const { feedUrl } = ensureData('subscriptionDetails')
	const subscription = useAppSelector(state =>
		selectSubscriptionWithItems(state, feedUrl),
	)

	const isPulling = useIsPulling({ subscription })

	const [filters, setFilters] = useState<Filters>({})

	const [filtersComitted, setFiltersComitted] = useState<Filters>({})

	const filteredItems = useMemo(() => {
		return applyFilters({ items: subscription.items, filters }).items
	}, [filtersComitted, subscription.items])

	const chunker = useChunker({ items: filteredItems, size: 15 })

	const handleChange = (filterName: keyof Filters) => {
		return (event: ChangeEvent<HTMLInputElement>) =>
			setFilters(prev => {
				const filtersNext = {
					...prev,
					[filterName]: event.currentTarget.value,
				}
				filterCommitThrottler(() => {
					setFiltersComitted(filtersNext)
				})
				return filtersNext
			})
	}

	return (
		<>
			<PageStack>
				<HStack>
					<Image
						src={subscription.image?.url}
						objectFit="cover"
						maxW="50px"
						data-testid="SubscriptionDetailsPage-image"
					/>
					<Heading as="h1">{subscription.title}</Heading>
				</HStack>

				<VStack maxWidth="50%" overflowX="scroll">
					<Text>
						Homepage:{' '}
						<chakra.span fontFamily="monospace">
							{subscription.link ?? '(Unknown)'}
						</chakra.span>
					</Text>
					<Text>
						Subscription URL (Includes authentication parameters, if any)
						<br />
						<chakra.span fontFamily="monospace">{subscription.url}</chakra.span>
					</Text>
					<DevOnly>
						<Text>
							Feed URL:
							<br />
							<chakra.span fontFamily="monospace">
								{subscription.feedUrl !== subscription.url
									? subscription.feedUrl
									: '(same)'}
							</chakra.span>
						</Text>
					</DevOnly>
				</VStack>

				<Heading as="h2">Episodes</Heading>

				<PageGrid>
					<GridItem colSpan={1}>
						{isPulling ? <Spinner /> : <ChunkerControls chunker={chunker} />}
					</GridItem>

					<GridItem colSpan={3}>
						<FormControl width="auto">
							<FormLabel>search</FormLabel>
							<Input
								type="text"
								value={filters.text ?? ''}
								onChange={handleChange('text')}
							/>
						</FormControl>
					</GridItem>

					<GridItem colSpan={4}>
						<HStack placeItems="center" width="full" wrap="wrap">
							{/* <Button variant="link">Clear</Button> */}
							<FormControl width="auto">
								<FormLabel>after</FormLabel>
								<Input
									type="date"
									value={filters.after ?? ''}
									onChange={handleChange('after')}
								/>
							</FormControl>
							<FormControl width="auto">
								<FormLabel>before</FormLabel>
								<Input
									type="date"
									value={filters.before ?? ''}
									onChange={handleChange('before')}
								/>
							</FormControl>
						</HStack>
					</GridItem>
				</PageGrid>

				<DebugFilters>
					{{ filters, filtersComitted, chunker: chunker.chunkInfo }}
				</DebugFilters>

				<EpisodesGrid>
					{chunker.chunk.map(item => (
						<EpisodeRow key={item.id} episode={{ subscription, item }} />
					))}
				</EpisodesGrid>
			</PageStack>
		</>
	)
}

const useIsPulling = ({ subscription }: { subscription: Subscription }) => {
	const status = useAppSelector(state =>
		selectPullStatus(state, subscription.url),
	)

	return status !== undefined
}

const ChunkerControls = ({
	chunker,
}: {
	chunker: Chunker<SubscriptionItem>
}) => {
	return (
		<VStack>
			<chakra.div>
				<Text
					fontVariantNumeric="tabular-nums"
					// Ensure no wrap when up to 3 digits
					minW={`${'100 - 200 of 999'.length}ch`}
				>
					{chunker.chunkInfo.first} - {chunker.chunkInfo.last} of{' '}
					{chunker.chunkInfo.total}
				</Text>
			</chakra.div>

			<HStack spacing={2}>
				<Button
					size="sm"
					aria-label="previous page"
					onClick={chunker.prevChunk}
				>
					{'<<'}
				</Button>
				<Button size="sm" aria-label="next page" onClick={chunker.nextChunk}>
					{'>>'}
				</Button>
			</HStack>
		</VStack>
	)
}

const DebugFilters = ({ children }: { children: unknown }) => {
	return (
		<DevOnly>
			<CodeBlock>{children}</CodeBlock>
		</DevOnly>
	)
}
