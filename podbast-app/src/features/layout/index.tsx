import { Box, Flex,  } from '@chakra-ui/react'

import { Player } from '/src/features/player'

import { Main } from './main'
import { Side } from './side'
import { Top } from './top'
import { VStack } from '/src/ui'

export const SideWrapper = () => (
	<Box
		bg="gray.700"
		width={[10, 200]}
		padding={[1, 2]}
		borderRightWidth={2}
		borderRightColor="black"
	>
		<Side />
	</Box>
)

export const MainWrapper = () => (
	<VStack padding={2} paddingTop={4} width="full">
		<Main />
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
		<Flex flexGrow="1">
			<SideWrapper />
			<MainWrapper />
		</Flex>
		<Bottom />
	</Flex>
)
