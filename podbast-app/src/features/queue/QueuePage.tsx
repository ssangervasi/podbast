import { Divider, Heading, Text } from '@chakra-ui/react'

import { selectMedia } from '/src/features/player/slice'
import { selectRecentlyPlayed } from '/src/features/subscriptions'
import { EpisodeRow } from '/src/features/subscriptions/EpisodeRow'
import { useAppSelector } from '/src/store'
import { EpisodesGrid, PageStack } from '/src/ui'

export const QueuePage = () => {
	useAppSelector(selectMedia)

	return (
		<PageStack>
			<Heading as="h1">Queue</Heading>
			<Text>Work in progress. For now, use recnetly played.</Text>
			<Divider />
			<RecentlyPlayed />
		</PageStack>
	)
}

export const RecentlyPlayed = () => {
	const episodes = useAppSelector(selectRecentlyPlayed)

	return (
		<>
			<Heading as="h2">Recently played</Heading>

			<EpisodesGrid>
				{episodes.map(episode => (
					<EpisodeRow key={episode.item.id} episode={episode} />
				))}
			</EpisodesGrid>
		</>
	)
}
