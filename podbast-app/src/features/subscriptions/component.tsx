import { Box, Text } from '@chakra-ui/react'

import { useAppSelector } from '/src/store'

import { selectSubscriptions } from './slice'

export const Subscriptions = () => {
	const subscriptions = useAppSelector(selectSubscriptions)

	return (
		<>
			<Text>Subs: {subscriptions.length}</Text>

			{subscriptions.map(sub => (
				<Box>{sub.title}</Box>
			))}
		</>
	)
}
