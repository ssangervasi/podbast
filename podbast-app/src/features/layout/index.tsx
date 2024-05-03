import { Box, Flex } from '@chakra-ui/react'

import { Player } from '/src/features/player'
import { VStack } from '/src/ui'

import { Main } from './main'
import { Side } from './side'
import { Top } from './top'

export const Layout = () => (
	<Flex
		direction="column"
		minH="100vh"
		// Scrollbar trickery
		width="calc(100vw - (100vw - 100%))"
		overflowX="hidden"
	>
		<Top />
		<Flex flexGrow="1" width="full">
			<SideWrapper />
			<MainWrapper />
		</Flex>
		<Bottom />
	</Flex>
)

export const SideWrapper = () => (
	<Box
		bg="gray.700"
		width={[20, 200]}
		padding={[1, 2]}
		borderRightWidth={2}
		borderRightColor="black"
	>
		<Side />
	</Box>
)

export const MainWrapper = () => (
	<VStack paddingX={2} paddingY={4} flex="1" overflowX="hidden">
		<Main />
	</VStack>
)

export const Bottom = () => (
	<Box>
		<Player />
	</Box>
)
