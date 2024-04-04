import { Box, Button, HStack } from '@chakra-ui/react'

import { makeRequest } from '/src/features/player'
import { useAppDispatch } from '/src/store'

import { Episode } from './models'

export const EpisodeControls = ({ episode }: { episode: Episode }) => {
	const { item } = episode
	const dispatch = useAppDispatch()

	return (
		<HStack>
			<Box>
				<Button
					aria-label="Play episode"
					size="sm"
					onClick={() => {
						dispatch(
							makeRequest({
								status: 'playing',
								media: {
									title: item.title,
									src: item.enclosure.url,
									item: {
										id: item.id,
										feedUrl: item.feedUrl,
									},
								},
							}),
						)
					}}
				>
					▶
				</Button>
			</Box>
		</HStack>
	)
}
