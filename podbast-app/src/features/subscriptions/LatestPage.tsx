import {
	Box,
	Button,
	Divider,
	GridItem,
	Heading,
	Image,
	SimpleGrid,
	Text,
} from '@chakra-ui/react'

import { useSubscriptionManager } from '/src/features/subscriptions/manager'
import { Episode } from '/src/features/subscriptions/models'
import { useAppSelector } from '/src/store'
import { HCenter, HStack, Stack } from '/src/ui'

import { EpisodeControls } from './EpisodeControls'
import { ExpandableLines } from './ExpandableLines'
import { selectRecentEpisodes } from './slice'

export const EpisodeRow = ({ episode }: { episode: Episode }) => (
	<>
		<GridItem colSpan={2}>
			<HStack alignItems="center">
				<Box>
					<Image
						src={episode.subscription.image?.url}
						objectFit="cover"
						maxW="30px"
					/>
				</Box>

				<Text
					noOfLines={3}
					fontSize="sm"
					fontWeight="bold"
					data-testid="EpisodeRow-subscription-title"
				>
					{episode.subscription.title}
				</Text>
			</HStack>
		</GridItem>

		<GridItem colSpan={2} data-testid="EpisodeRow-item-title">
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

export const LatestPage = () => {
	const { refresh } = useSubscriptionManager()
	const episodes = useAppSelector(selectRecentEpisodes)

	return (
		<>
			<Stack w="full">
				<Heading as='h1' size="lg">Latest episodes</Heading>
				<HStack>
					<Button onClick={refresh}>Refresh</Button>
				</HStack>

				<SimpleGrid columns={12} spacing={2} w="full">
					{episodes.map(episode => (
						<EpisodeRow key={episode.item.id} episode={episode} />
					))}
				</SimpleGrid>
			</Stack>
		</>
	)
}
