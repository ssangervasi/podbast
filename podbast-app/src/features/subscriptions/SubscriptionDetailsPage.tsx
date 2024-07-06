import {
	Box,
	chakra,
	GridItem,
	Heading,
	HStack,
	Image,
	Spinner,
	Text,
} from '@chakra-ui/react'

import { useLayout } from '/src/features/layout/useLayout'
import { selectPullStatus } from '/src/features/rss/slice'
import { EpisodeRow } from '/src/features/subscriptions/EpisodeRow'
import { Subscription } from '/src/features/subscriptions/models'
import { useAppSelector } from '/src/store'
import { PageGrid, PageStack } from '/src/ui'
import { log, useChunker } from '/src/utils'

import { selectSubscriptionWithItems } from './slice'

export const SubscriptionDetailsPage = () => {
	const { ensureData } = useLayout()

	const { feedUrl } = ensureData('subscriptionDetails')
	const subscription = useAppSelector(state =>
		selectSubscriptionWithItems(state, feedUrl),
	)

	const chunker = useChunker({ items: subscription.items })

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

				<Box>{subscription.items.length}</Box>
				<Box>{JSON.stringify(subscription.activity)}</Box>

				<PageGrid>
					{chunker.chunk.map(item => (
						<EpisodeRow key={item.id} episode={{ subscription, item }} />
					))}

					{chunker.itemsAfter > 0 ? (
						<GridItem colSpan={12}>... and {chunker.itemsAfter} more</GridItem>
					) : null}

					<SubscriptionLoadingRow subscription={subscription} />
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
