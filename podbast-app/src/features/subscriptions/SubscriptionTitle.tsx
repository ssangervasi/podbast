import { Box, Button, Image, Text } from '@chakra-ui/react'

import { useLayout } from '/src/features/layout/useLayout'
import { Subscription } from '/src/features/subscriptions/models'
import { HStack } from '/src/ui'

export const SubscriptionTitle = ({
	subscription,
}: {
	subscription: Pick<Subscription, 'title' | 'image' | 'feedUrl'>
}) => {
	const { title, image, feedUrl } = subscription
	const { show } = useLayout()

	return (
		<HStack alignItems="center" data-testid="SubscriptionTitle">
			<Box>
				<Image
					src={image?.url}
					objectFit="cover"
					maxW="30px"
					data-testid="SubscriptionTitle-image"
				/>
			</Box>

			<Text
				noOfLines={3}
				fontSize="sm"
				fontWeight="bold"
				data-testid="SubscriptionTitle-text"
			>
				{title}
			</Text>

			<Button
				variant="link"
				onClick={() => show('subscriptionDetails', { feedUrl })}
			>
				Details
			</Button>
		</HStack>
	)
}
