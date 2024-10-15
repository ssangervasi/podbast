import { Box, Flex } from '@chakra-ui/react'
import { narrow } from 'narrow-minded'
import { useEffect } from 'preact/hooks'

import { actions, selectLayout } from '/src/features/layout/slice'
import { Player } from '/src/features/player'
import { useAppDispatch, useAppSelector } from '/src/store'
import { VStack } from '/src/ui'
import { log } from '/src/utils'
import { optional } from '/src/utils/narrows'

import { Main } from './main'
import { Side } from './side'
import { Top } from './top'

const logger = log.with({ prefix: 'layout' })

/**
 * "I'm totally not a router I sware ;)"
 */
const useLayoutHistory = () => {
	const dispatch = useAppDispatch()

	const layoutState = useAppSelector(selectLayout)

	useEffect(() => {
		logger('pushState', layoutState)

		document.title = layoutState.layout
		window.history.pushState(layoutState, '')
	}, [layoutState])

	useEffect(() => {
		const handlePopstate = (event: PopStateEvent) => {
			const historyState = event.state

			logger('popState', historyState)
			if (narrow({ layout: 'string', data: optional({}) }, historyState))
				dispatch(
					actions.show({
						name: historyState.layout,
						data: historyState.data,
					} as any),
				)
		}

		window.addEventListener('popstate', handlePopstate)
		return () => {
			window.removeEventListener('popstate', handlePopstate)
		}
	}, [])
}

export const Layout = () => {
	useLayoutHistory()

	return (
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
}

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
