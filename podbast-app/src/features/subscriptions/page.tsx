import {
	Card,
	CardHeader,
	Divider,
	GridItem,
	Image,
	SimpleGrid,
	Text,
} from '@chakra-ui/react'

import { useAppSelector } from '/src/store'
import { HStack, Stack, VCenter } from '/src/ui'

import { selectRecentEpisodes, selectSubSummaries, SubEp } from './slice'

export const SummaryView = ({ summary }: { summary: { title: string } }) => (
	<Card>
		<CardHeader>{summary.title}</CardHeader>
	</Card>
)

export const EpisodeRow = ({ episode }: { episode: SubEp }) => (
	<>
		<VCenter>
			<Image src={episode.feed.image?.url} objectFit="cover" maxW="30px" />
		</VCenter>

		<VCenter>
			<Text maxW="16ch" noOfLines={2} fontSize="sm">
				{episode.feed.title}
			</Text>
		</VCenter>

		<VCenter>
			<Text maxW="40ch" noOfLines={2} fontSize="sm">
				{episode.item.title}
			</Text>
		</VCenter>

		<GridItem colSpan={3}>
			<Divider />
		</GridItem>
	</>
)

export const Page = () => {
	const summaries = useAppSelector(selectSubSummaries)
	const episodes = useAppSelector(selectRecentEpisodes)

	return (
		<>
			<Stack>
				<HStack>
					{summaries.map(summary => (
						<SummaryView key={summary.link} summary={summary} />
					))}
				</HStack>

				<Text>Recent episodes: {episodes.length}</Text>

				<SimpleGrid spacing={2}>
					{episodes.map(episode => (
						<EpisodeRow key={episode.item.link} episode={episode} />
					))}
				</SimpleGrid>
			</Stack>
		</>
	)
}
