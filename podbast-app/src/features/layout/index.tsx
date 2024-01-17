import { Box, Flex, VStack } from '@chakra-ui/react'

import { Player } from '/src/features/player'
import { Rss } from '/src/features/rss'

export const Top = () => (
	<Box
		bg="gray.700"
		height={100}
		borderBottomWidth={2}
		borderBottomColor="black"
	/>
)

export const Side = () => (
	<Box
		flexShrink="0"
		bg="gray.700"
		width={[10, 200]}
		padding={[1, 2]}
		borderRightWidth={2}
		borderRightColor="black"
	>
		<p>Sweet cool yay</p>
	</Box>
)

export const Main = () => (
	<VStack padding={4}>
		<Rss />
	</VStack>
)

export const Bottom = () => (
	<Box>
		<Player />
	</Box>
)

export const Layout = () => (
	<Flex direction="column" minH="100vh">
		<Top />
		<Flex
			flexGrow="1"
			// border="5px dashed hotpink"
		>
			<Side />
			<Main />
		</Flex>
		<Bottom />
	</Flex>
)
