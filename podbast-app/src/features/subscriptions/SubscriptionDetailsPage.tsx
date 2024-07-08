import {
	Box,
	Button,
	chakra,
	GridItem,
	Heading,
	Image,
	Spinner,
	Text,
} from '@chakra-ui/react'

import { useLayout } from '/src/features/layout/useLayout'
import { selectPullStatus } from '/src/features/rss/slice'
import { EpisodeRow } from '/src/features/subscriptions/EpisodeRow'
import { Subscription } from '/src/features/subscriptions/models'
import { useAppSelector } from '/src/store'
import { HStack, PageGrid, PageStack, VStack } from '/src/ui'
import { log, useChunker } from '/src/utils'

import { selectSubscriptionWithItems } from './slice'

export const SubscriptionDetailsPage = () => {
	const { ensureData } = useLayout()

	const { feedUrl } = ensureData('subscriptionDetails')
	const subscription = useAppSelector(state =>
		selectSubscriptionWithItems(state, feedUrl),
	)

	const chunker = useChunker({ items: subscription.items, size: 15 })

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
					{chunker.chunk.map(item => (
						<EpisodeRow key={item.id} episode={{ subscription, item }} />
					))}

					{chunker.itemsAfter > 0 ? (
						<GridItem colSpan={12}>... and {chunker.itemsAfter} more</GridItem>
					) : null}

					<SubscriptionLoadingRow subscription={subscription} />

					<GridItem colSpan={12}>
						<Button onClick={chunker.nextChunk}>Next page</Button>
					</GridItem>
				</PageGrid>
			</PageStack>
		</>
	)
}

const SubscriptionLoadingRow = ({
	subscription,
}: {
	subscription: Subscription
}) => {
	const status = useAppSelector(state =>
		selectPullStatus(state, subscription.url),
	)

	if (status !== 'requested') {
		return null
	}

	return (
		<GridItem colSpan={12}>
			<Spinner />
		</GridItem>
	)
}
