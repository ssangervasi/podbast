import { Button, HStack } from '@chakra-ui/react'

import { play } from '/src/features/player'
import { useAppDispatch } from '/src/store'

import { Episode } from './models'

export const EpisodeControls = ({ episode }: { episode: Episode }) => {
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
