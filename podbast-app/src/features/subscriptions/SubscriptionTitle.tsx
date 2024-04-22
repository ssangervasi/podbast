import { Box, Image, Text } from '@chakra-ui/react'

import { Subscription } from '/src/features/subscriptions/models'
import { HStack } from '/src/ui'

export const SubscriptionTitle = ({
	subscription,
}: {
	subscription: Pick<Subscription, 'title' | 'image'>
}) => (
	<HStack alignItems="center" data-testid="SubscriptionTitle">
		<Box>
			<Image
				src={subscription.image?.url}
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
			{subscription.title}
		</Text>
	</HStack>
)
