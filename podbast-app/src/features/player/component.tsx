import { Box, Text, useTimeout } from '@chakra-ui/react'
import { useMeasure } from '@uidotdev/usehooks'
import { RefObject } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import { log } from '/src/utils'
import { CATJAM } from '/src/utils/images'

import { CorePlayer } from './corePlayer'

export const Player = () => {
	const [fixedRef, rect] = useMeasure()

	useTimeout

	return (
		<>
			{/* Spacer to ensure fixed content position doesn't hide main content*/}
			<Box
				sx={{
					position: 'relative',
					overflow: 'hidden',
					height: rect.height ? rect.height * 0.95 : 0,
					width: 'full',
					// JAMJAMJAMJAM
					backgroundImage: rect.height ? CATJAM : 'none',
					backgroundRepeat: 'round',
				}}
			></Box>

			<Box
				ref={fixedRef}
				sx={{
					position: 'fixed',
					right: 0,
					bottom: 0,
					left: 0,
					backgroundColor: '#202535',
					minHeight: 50,
					//
					display: 'flex',
					flexDirection: 'row',
					placeContent: 'center',
					placeItems: 'center',

					// JAMJAMJAM
					transitionProperty: 'opacity',
					':hover': {
						transitionDuration: '30s',
						transitionTimingFunction: 'ease-in',
						opacity: 0.85,
					},
				}}
			>
				<Box
					sx={{
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						placeContent: 'center',
						placeItems: 'start',
						gap: '8px',
					}}
				>
					<Text>Player</Text>

					<CorePlayer />
				</Box>
			</Box>
		</>
	)
}
