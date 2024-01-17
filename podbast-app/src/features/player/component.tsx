import { Box, Text } from '@chakra-ui/react'

import { CorePlayer } from './corePlayer'

export const Player = () => {
	return (
		<>
			{/* Spacer to ensure fixed content position doesn't hide main content*/}
			<Box
				sx={{
					position: 'relative',
					overflow: 'hidden',
					// height: 120,
				}}
			/>

			<Box
				sx={{
					// height: 120,
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
