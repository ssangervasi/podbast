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
import { getPubDate, Subscription } from '/src/features/subscriptions/models'
import { useAppSelector } from '/src/store'
import { HStack, PageGrid, PageStack, VStack } from '/src/ui'
import { createThrottler, useChunker } from '/src/utils'
import { fromIso } from '/src/utils/datetime'

import { selectSubscriptionWithItems } from './slice'

const filtersThrottler = createThrottler(200)

export const SubscriptionDetailsPage = () => {
	const { ensureData } = useLayout()

	const { feedUrl } = ensureData('subscriptionDetails')
	const subscription = useAppSelector(state =>
		selectSubscriptionWithItems(state, feedUrl),
	)

	const isPulling = useIsPulling({ subscription })

	const [filters, setFilters] = useState<{
		after?: string
		before?: string
	}>({})

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
	}, [filters, subscription.items])

	const chunker = useChunker({ items: filteredItems, size: 15 })

	const handleChange = (filterName: keyof typeof filters) => {
		return (event: ChangeEvent<HTMLInputElement>) =>
			filtersThrottler(() => {
				setFilters(prev => ({
					...prev,
					[filterName]: event.currentTarget.value,
				}))
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
					<GridItem colSpan={4}>
						<HStack placeItems="center" height="full" wrap="wrap">
							{isPulling ? (
								<Spinner />
							) : (
								<>
									<Text>
										{chunker.chunkInfo.first} - {chunker.chunkInfo.last} of{' '}
										{chunker.chunkInfo.total}
									</Text>
									<Button
										size="sm"
										aria-label="previous page"
										onClick={chunker.prevChunk}
									>
										{'<<'}
									</Button>
									<Button
										size="sm"
										aria-label="next page"
										onClick={chunker.nextChunk}
									>
										{'>>'}
									</Button>
								</>
							)}
						</HStack>
					</GridItem>
					<GridItem colSpan={8}>
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

					{chunker.chunk.map(item => (
						<EpisodeRow key={item.id} episode={{ subscription, item }} />
					))}
				</PageGrid>
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
