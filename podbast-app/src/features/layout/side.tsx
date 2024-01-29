import { Box, Button, Text } from '@chakra-ui/react'

import { useLayout } from './useLayout'

export const Side = () => {
	const { show } = useLayout()

	return (
		<>
			<Text>Sidebar</Text>
			<Box>
				<Button variant="ghost" onClick={() => show('rss')}>
					Add feed
				</Button>
			</Box>
			<Box>
				<Button variant="ghost" onClick={() => show('subscriptions')}>
					Subscriptions
				</Button>
			</Box>
		</>
	)
}
