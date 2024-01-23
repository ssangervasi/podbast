import { Box, Flex, HStack, Link, Text, VStack } from '@chakra-ui/react'

import { Player } from '/src/features/player'
import { Rss } from '/src/features/rss'

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

export const Side = () => (
	<Box
		flexShrink="0"
		bg="gray.700"
		width={[10, 200]}
		padding={[1, 2]}
		borderRightWidth={2}
		borderRightColor="black"
	>
		<Text>Sweet cool yay</Text>
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
