import { Box, Button, chakra, HStack, VStack } from '@chakra-ui/react'

import { play } from '/src/features/player'
import { useAppDispatch } from '/src/store'

import { SubEp } from './slice'

export const EpisodeControls = ({ episode }: { episode: SubEp }) => {
	const { item } = episode
	const dispatch = useAppDispatch()

	return (
		<HStack>
			<Button
				size="sm"
				onClick={() => {
					dispatch(
						play({
							title: item.title,
							url: item.enclosure.url,
						}),
					)
				}}
			>
				▶
			</Button>
		</HStack>
	)
}
