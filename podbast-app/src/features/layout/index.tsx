import { Box, Center } from '@chakra-ui/react'

import { Player } from '/src/features/player'
import { Rss } from '/src/features/rss'

export const Top = () => <Box bg="gray.100" />

export const Side = () => <Box bg="gray.200" />

export const Main = () => (
	<Center paddingY={10}>
		<Rss />
	</Center>
)

export const Bottom = () => <Player />

export const Layout = () => (
	<Box>
		<Top />
		<Side />
		<Main />
		<Bottom />
	</Box>
)
