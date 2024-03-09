import { Box, Text } from '@chakra-ui/react'

import { useAppDispatch, useAppSelector } from '/src/store'

import { selectRecentEpisodes, selectSubSummaries } from './slice'

export const Page = () => {
	const summaries = useAppSelector(selectSubSummaries)
	const episodes = useAppSelector(selectRecentEpisodes)

	return (
		<>
			<Text>Subs: {summaries.length}</Text>

			{summaries.map(summ => (
				<Box key={summ.link}>{summ.title}</Box>
			))}

			<Text>Recent episodes: {episodes.length}</Text>

			{episodes.map(ep => (
				<Box key={ep.item.guid}>{ep.item.title}</Box>
			))}
		</>
	)
}
