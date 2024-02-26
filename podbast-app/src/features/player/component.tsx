import { Box, Text } from '@chakra-ui/react'
import { RefObject } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import { log } from '/src/utils'

import { CorePlayer } from './corePlayer'

const useSpacing = <El extends HTMLElement, Init extends Partial<DOMRect>>({
	ref,
	initial,
}: {
	ref: RefObject<El>
	initial: Init
}) => {
	const [state, setState] = useState<DOMRect>()

	useEffect(() => {
		const el = ref.current
		log.info('usespacing', el)

		if (!el) {
			return
		}

		setState(el.getBoundingClientRect())
	}, [ref.current])

	return state ?? initial
}

export const Player = () => {
	const fixedRef = useRef<HTMLDivElement>(null)

	const spacing = useSpacing({ ref: fixedRef, initial: { height: 100 } })

	return (
		<>
			{/* Spacer to ensure fixed content position doesn't hide main content*/}
			<Box
				sx={{
					// position: 'relative',
					// overflow: 'hidden',
					height: spacing.height,
				}}
			>
				wha
			</Box>

			<Box
				ref={fixedRef}
				sx={{
					position: 'fixed',
					right: 0,
					bottom: 0,
					left: 0,
					backgroundColor: '#202535',
					//
					display: 'flex',
					flexDirection: 'row',
					placeContent: 'center',
					placeItems: 'center',
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
