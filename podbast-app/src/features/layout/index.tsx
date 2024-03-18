import { Box, Flex, HStack, Link, Text, VStack } from '@chakra-ui/react'

import { Player } from '/src/features/player'

import { Main } from './main'
import { Side } from './side'

export const Top = () => (
	<HStack
		justify="space-between"
		bg="gray.700"
		borderBottomWidth={2}
		borderBottomColor="black"
		paddingX={2}
		paddingY={0.5}
	>
		<HStack as="header">
			<Text fontSize="3xl" fontWeight="bold" color="purple.100" children="🜪" />
			<Text fontSize="xl" fontWeight="bold">
				podbast
			</Text>
		</HStack>

		<HStack>
			<Link href="https://github.com/ssangervasi/podbast" isExternal>
				source
			</Link>
		</HStack>
	</HStack>
)

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
	<VStack padding={2} width="full">
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
