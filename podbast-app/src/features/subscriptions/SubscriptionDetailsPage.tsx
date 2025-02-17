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

export const SubscriptionDetailsPage = () => {
	const { ensureData } = useLayout()

	const { feedUrl } = ensureData('subscriptionDetails')
	const subscription = useAppSelector(state =>
		selectSubscriptionWithItems(state, feedUrl),
	)

	const isPulling = useIsPulling({ subscription })

	const [filters, setFilters] = useState<{
		text?: string
		after?: string
		before?: string
	}>({})

	const [filtersComitted, setFiltersComitted] = useState<typeof filters>({})

	const filteredItems = useMemo(() => {
		const items = subscription.items
		if (!narrow({ after: 'string', before: 'string' }, filters)) {
			return subscription.items
		}

		const earliestIndex = items.findIndex(
			item => fromIso(filters.after) <= getPubDate(item),
		)
		const latestIndex = items.findIndex(
			item => getPubDate(item) <= fromIso(filters.before),
		)

		return items.slice(earliestIndex, latestIndex + 1)
	}, [filtersComitted, subscription.items])

	const chunker = useChunker({ items: filteredItems, size: 15 })

	const handleChange = (filterName: keyof typeof filters) => {
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

				<VStack>
					<Text>
						Homepage:{' '}
						<chakra.span fontFamily="monospace">
							{subscription.link}
						</chakra.span>
					</Text>
					<Text>
						Feed URL:{' '}
						<chakra.span fontFamily="monospace">
							{subscription.feedUrl}
						</chakra.span>
					</Text>
					<Text>
						Subscription URL:{' '}
						<chakra.span fontFamily="monospace">{subscription.url}</chakra.span>
						<br />
						(Includes authentication parameters, if any)
					</Text>
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

				<DebugFilters>{{ filters, filtersComitted }}</DebugFilters>

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
				<Text>
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
