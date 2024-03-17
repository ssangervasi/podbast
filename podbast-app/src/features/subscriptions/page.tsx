import {
	Box,
	Card,
	CardBody,
	CardHeader,
	Heading,
	Image,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VisuallyHidden,
} from '@chakra-ui/react'

import { useAppDispatch, useAppSelector } from '/src/store'
import { HStack, Stack } from '/src/ui'

import { selectRecentEpisodes, selectSubSummaries, SubEp } from './slice'

export const SummaryView = ({ summary }: { summary: { title: string } }) => (
	<Card>
		<CardHeader>{summary.title}</CardHeader>
	</Card>
)

export const EpisodeRow = ({ episode }: { episode: SubEp }) => (
	<Tr>
		<Td>
			<HStack>
				<Image src={episode.feed.image?.url} objectFit="cover" maxW="25px" />

				<Text
					w={20}
					noOfLines={2}
					// overflow="
					// overflow="wrap"
					// textOverflow="clip"
					// overflowWrap="anywhere"
				>
					{episode.feed.title}
				</Text>
			</HStack>
		</Td>

		<Td>
			<Text
				maxW="40ch"
				// maxH="10px"
				noOfLines={1}
				background="black"
			>
				{episode.item.title}
			</Text>
		</Td>
	</Tr>
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

				<TableContainer>
					<Table size="sm">
						<Thead>
							<Tr>
								<Th>Feed</Th>
								<Th>Episode</Th>
								<Th isNumeric>
									<VisuallyHidden>Runtime</VisuallyHidden>
								</Th>
								<Th>
									<VisuallyHidden>Actions</VisuallyHidden>
								</Th>
							</Tr>
						</Thead>

						<Tbody>
							{episodes.map(episode => (
								<EpisodeRow key={episode.item.link} episode={episode} />
							))}
						</Tbody>
					</Table>
				</TableContainer>
			</Stack>
		</>
	)
}
