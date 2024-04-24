import { chakra, GridItem, Heading, Text } from '@chakra-ui/react'

import { Subscription } from '/src/features/subscriptions/models'
import { SubscriptionTitle } from '/src/features/subscriptions/SubscriptionTitle'
import { useAppSelector } from '/src/store'
import { PageGrid, PageStack, RowWrapper } from '/src/ui'

import { selectSubSummaries } from './slice'

export const SubscriptionsPage = () => {
	const subscriptions = useAppSelector(selectSubSummaries)

	return (
		<>
			<PageStack>
				<Heading as="h1" size="lg">
					Podcast subscriptions
				</Heading>

				{subscriptions.length === 0 ? (
					<Text>
						Looks like you haven't subscribed to any podcast feeds yet. Go add
						an RSS feed!
					</Text>
				) : null}

				<PageGrid>
					{subscriptions.map(subscription => (
						<SubscriptionView
							key={subscription.link}
							subscription={subscription}
						/>
					))}
				</PageGrid>
			</PageStack>
		</>
	)
}

export const SubscriptionView = ({
	subscription,
}: {
	subscription: Subscription
}) => {
	return (
		<>
			<RowWrapper>
				<GridItem colSpan={4}>
					<SubscriptionTitle subscription={subscription} />
				</GridItem>

				<GridItem colSpan={8}>
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
					</Text>
				</GridItem>
			</RowWrapper>
		</>
	)
}
