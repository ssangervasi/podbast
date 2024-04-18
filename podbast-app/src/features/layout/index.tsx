import { Box, Flex } from '@chakra-ui/react'

import { Player } from '/src/features/player'
import { VStack } from '/src/ui'

import { Main } from './main'
import { Side } from './side'
import { Top } from './top'

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

export const Layout = () => (
	<Flex direction="column" minH="100vh" width="100vw" overflowX="hidden">
		<Top />
		<Flex flexGrow="1" width="full">
			<SideWrapper />
			<MainWrapper />
		</Flex>
		<Bottom />
	</Flex>
)
