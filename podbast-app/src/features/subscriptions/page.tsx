import {
	Box,
	Button,
	Card,
	CardHeader,
	Center,
	Divider,
	GridItem,
	Heading,
	IconButton,
	Image,
	SimpleGrid,
	Text,
	TextProps,
	useDisclosure,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@vidstack/react/icons'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { useAppSelector } from '/src/store'
import { HCenter, HStack, Stack } from '/src/ui'

import { selectRecentEpisodes, selectSubSummaries, SubEp } from './slice'

const SummaryView = ({ summary }: { summary: { title: string } }) => (
	<Card size="sm">
		<CardHeader>
			<Text size="xs">{summary.title}</Text>
		</CardHeader>
	</Card>
)

const ExpandableLines = (props: TextProps) => {
	const { noOfLines: noOfLinesCollapsed, children } = props
	const { isOpen, onToggle } = useDisclosure()

	return (
		<Box>
			<Text noOfLines={isOpen ? undefined : noOfLinesCollapsed}>
				{children}
			</Text>
			<HCenter width="full" border="1px solid white">
				<IconButton
					aria-label="Expand text"
					variant="unstyled"
					icon={
						<Box
							transform={isOpen ? 'rotate(180deg)' : ''}
							transitionProperty="transform"
							transitionDuration="0.25s"
						>
							<ChevronDownIcon />
						</Box>
					}
					onClick={onToggle}
				/>
			</HCenter>
		</Box>
	)
}

export const EpisodeRow = ({ episode }: { episode: SubEp }) => (
	<>
		<GridItem colSpan={2}>
			<HStack alignItems="center">
				<Box>
					<Image src={episode.feed.image?.url} objectFit="cover" maxW="30px" />
				</Box>

				<Text noOfLines={3} fontSize="sm">
					{episode.feed.title}
				</Text>
			</HStack>
		</GridItem>

		<GridItem colSpan={2}>
			{/* <HCenter> */}
			<Text maxW="40ch" noOfLines={3} fontSize="sm" fontWeight="">
				{episode.item.title}
			</Text>
			{/* </HCenter> */}
		</GridItem>

		<GridItem colSpan={6}>
			<HCenter>
				<ExpandableLines maxW="40ch" noOfLines={4} fontSize="sm">
					{episode.item.contentSnippet}
				</ExpandableLines>
			</HCenter>
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
