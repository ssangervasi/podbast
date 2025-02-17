import { Button } from '@chakra-ui/react'

import { useAppDispatch } from '/src/store'
import { HCenter } from '/src/ui'

import { Episode } from './models'
import { markPlayed } from './slice'

export const EpisodeControls = ({ episode }: { episode: Episode }) => {
	const { item } = episode
	const dispatch = useAppDispatch()

	return (
		<HCenter>
			<Button
				aria-label="Mark played"
				size="sm"
				onClick={() => {
					dispatch(
						markPlayed({
							feedUrl: item.feedUrl,
							id: item.id,
						}),
					)
				}}
			>
				✔
			</Button>
		</HCenter>
	)
}
