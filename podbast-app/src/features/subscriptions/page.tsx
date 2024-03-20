import {
	Box,
	Button,
	Card,
	CardHeader,
	Center,
	Divider,
	GridItem,
	Heading,
	Image,
	SimpleGrid,
	Text,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { useAppSelector } from '/src/store'
import { HCenter, HStack, Stack } from '/src/ui'

import { EpisodeControls } from './EpisodeControls'
import { ExpandableLines } from './ExpandableLines'
import { selectRecentEpisodes, selectSubSummaries, SubEp } from './slice'

export const EpisodeRow = ({ episode }: { episode: SubEp }) => (
	<>
		<GridItem colSpan={2}>
			<HStack alignItems="center">
				<Box>
					<Image src={episode.feed.image?.url} objectFit="cover" maxW="30px" />
				</Box>

				<Text noOfLines={3} fontSize="sm" fontWeight="bold">
					{episode.feed.title}
				</Text>
			</HStack>
		</GridItem>

		<GridItem colSpan={2}>
			<Text maxW="40ch" noOfLines={3} fontStyle="italic">
				{episode.item.title}
			</Text>
		</GridItem>

		<GridItem colSpan={6}>
			<HCenter>
				<ExpandableLines maxW="40ch" noOfLines={2}>
					{episode.item.contentSnippet}
				</ExpandableLines>
			</HCenter>
		</GridItem>

		<GridItem colSpan={2}>
			<EpisodeControls episode={episode} />
		</GridItem>

		<GridItem colSpan={12}>
			<Divider />
		</GridItem>
	</>
)

export const Page = () => {
	const summaries = useAppSelector(selectSubSummaries)
	const episodes = useAppSelector(selectRecentEpisodes)

	return (
		<>
			<Stack w="full">
				<Heading size="md">Recent episodes</Heading>

				<SimpleGrid columns={12} spacing={2} w="full">
					{episodes.map(episode => (
						<EpisodeRow key={episode.item.link} episode={episode} />
					))}
				</SimpleGrid>
			</Stack>
		</>
	)
}
