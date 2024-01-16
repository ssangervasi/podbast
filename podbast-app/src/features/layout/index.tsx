import { Box } from '@chakra-ui/react'

import { Player } from '/src/features/player'
import { Rss } from '/src/features/rss'

export const Layout = () => {
	return (
		<Box>
			<Rss />
			<Player />
		</Box>
	)
}
