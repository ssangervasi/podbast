import { Box, Text, useTimeout } from '@chakra-ui/react'
import { useRef } from 'preact/hooks'

import { CATJAM } from '/src/utils/images'

import { CorePlayer } from './corePlayer'

const PLAYER_HEIGHT = 100

export const Player = () => {
	return (
		<>
			{/* Spacer to ensure fixed content position doesn't hide main content*/}
			<Box
				sx={{
					position: 'relative',
					overflow: 'hidden',
					height: PLAYER_HEIGHT * 0.95,
					marginTop: PLAYER_HEIGHT * 0.95,
					width: 'full',
					// JAMJAMJAMJAM
					backgroundImage: CATJAM,
					backgroundRepeat: 'round',
				}}
			></Box>

			<Box
				sx={{
					position: 'fixed',
					right: 0,
					bottom: 0,
					left: 0,
					backgroundColor: '#202535',
					height: PLAYER_HEIGHT,
					//
					display: 'flex',
					flexDirection: 'row',
					placeContent: 'center',
					placeItems: 'center',
					padding: 2,

					// JAMJAMJAM
					transitionProperty: 'opacity',
					':hover': {
						transitionDuration: '30s',
						transitionTimingFunction: 'ease-in',
						opacity: 0.85,
					},
				}}
			>
				<CorePlayer />
			</Box>
		</>
	)
}
