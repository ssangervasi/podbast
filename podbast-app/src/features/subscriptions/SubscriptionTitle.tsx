import { Box, Button, Image, Text } from '@chakra-ui/react'

import { useLayout } from '/src/features/layout/useLayout'
import { Subscription } from '/src/features/subscriptions/models'
import { HStack } from '/src/ui'

export const SubscriptionTitle = ({
	subscription,
}: {
	subscription: Pick<Subscription, 'title' | 'image' | 'feedKey'>
}) => {
	const { title, image, feedKey } = subscription
	const { show } = useLayout()

	return (
		<HStack alignItems="center" data-testid="SubscriptionTitle">
			<Box>
				<Button
					variant="none"
					onClick={() => show('subscriptionDetails', { feedUrl: feedKey })}
				>
					<Image
						src={image?.url}
						objectFit="cover"
						maxW="30px"
						data-testid="SubscriptionTitle-image"
					/>
				</Button>
			</Box>

			<Text
				noOfLines={3}
				fontSize="sm"
				fontWeight="bold"
				data-testid="SubscriptionTitle-text"
			>
				{title}
			</Text>
		</HStack>
	)
}
