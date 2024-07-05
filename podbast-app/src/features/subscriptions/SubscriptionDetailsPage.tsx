import { Box, chakra, GridItem, Heading, Text } from '@chakra-ui/react'

import { useLayout } from '/src/features/layout/useLayout'
import { EpisodeRow } from '/src/features/subscriptions/EpisodeView'
import { SubscriptionTitle } from '/src/features/subscriptions/SubscriptionTitle'
import { useAppSelector } from '/src/store'
import { PageGrid, PageStack } from '/src/ui'
import { log } from '/src/utils'

import { selectSubscriptionWithItems } from './slice'

export const SubscriptionDetailsPage = () => {
	const { ensureData } = useLayout()

	const { feedUrl } = ensureData('subscriptionDetails')
	const subscription = useAppSelector(state => {
		log('SubscriptionDetailsPage useAppSelector')
		return selectSubscriptionWithItems(state, feedUrl)
	})

	return (
		<>
			<PageStack>
				<SubscriptionTitle subscription={subscription} />
				{/* <Heading as="h1">Podcast subscriptions</Heading> */}

				<PageGrid>{subscription.title}</PageGrid>
				<Box>{subscription.items.length}</Box>
				<Box>{JSON.stringify(subscription.activity)}</Box>

				<PageGrid>
					{subscription.items.map(item => (
						<EpisodeRow key={item.id} episode={{ subscription, item }} />
					))}
				</PageGrid>
			</PageStack>
		</>
	)
}
