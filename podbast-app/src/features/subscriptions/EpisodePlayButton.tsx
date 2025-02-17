import { Button } from '@chakra-ui/react'

import { makeRequest } from '/src/features/player'
import { useAppDispatch } from '/src/store'

import { Episode } from './models'

export const EpisodePlayButton = ({ episode }: { episode: Episode }) => {
	const { item } = episode
	const dispatch = useAppDispatch()

	/* Never give in to using icons. UTF is truth. */
	return (
		<Button
			aria-label="Play episode"
			size="md"
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
							currentTime: item.activity.progressTime,
						},
					}),
				)
			}}
		>
			▶
		</Button>
	)
}
