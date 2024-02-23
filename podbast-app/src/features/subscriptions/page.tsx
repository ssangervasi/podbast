import { Box, Text } from '@chakra-ui/react'

import { useAppDispatch, useAppSelector } from '/src/store'

import { selectSubscriptions } from './slice'

export const Page = () => {
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
