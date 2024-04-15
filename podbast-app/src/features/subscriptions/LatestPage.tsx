import { CheckCircleIcon, TimeIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	chakra,
	GridItem,
	Heading,
	Image,
	SimpleGrid,
	Text,
} from '@chakra-ui/react'

import { useSubscriptionManager } from '/src/features/subscriptions/manager'
import {
	Episode,
	SubscriptionItemActivity,
} from '/src/features/subscriptions/models'
import { useAppSelector } from '/src/store'
import { HCenter, HStack, PageStack, RowWrapper } from '/src/ui'
import { ExpandableLines } from '/src/ui/ExpandableLines'
import { isoToShortDate, secondsToTimeString } from '/src/utils/datetime'

import { EpisodeControls } from './EpisodeControls'
import { selectRecentEpisodes } from './slice'

export const EpisodeRow = ({ episode }: { episode: Episode }) => (
	<>
		<RowWrapper>
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
				<Date isoDate={episode.item.isoDate} />
			</GridItem>

			<GridItem colSpan={2} data-testid="EpisodeRow-item-title">
				<Text maxW="40ch" noOfLines={3} fontStyle="italic">
					{episode.item.title}
				</Text>
			</GridItem>

			<GridItem colSpan={1}>
				<EpisodeActivity activity={episode.item.activity} />
			</GridItem>

			<GridItem colSpan={5}>
				<HCenter>
					<ExpandableLines maxW="40ch" noOfLines={2}>
						{episode.item.contentSnippet}
					</ExpandableLines>
				</HCenter>
			</GridItem>

			<GridItem colSpan={2}>
				<EpisodeControls episode={episode} />
			</GridItem>
		</RowWrapper>
	</>
)

const Time = ({ seconds }: { seconds: number }) => (
	<chakra.span fontFamily="monospace" fontSize="x-small">
		{secondsToTimeString(seconds)}
	</chakra.span>
)

const Date = ({ isoDate }: { isoDate: string }) => (
	<chakra.span fontFamily="monospace" fontSize="x-small">
		{isoToShortDate(isoDate)}
	</chakra.span>
)

const EpisodeActivity = ({
	activity,
}: {
	activity: SubscriptionItemActivity
}) => {
	const { durationTime, progressTime, completedIsoDate, playedIsoDate } =
		activity
	return (
		<>
			{progressTime !== undefined ? (
				<>
					<Time seconds={progressTime} />
					<chakra.span>{' /\n'}</chakra.span>
				</>
			) : null}
			{durationTime !== undefined ? (
				<Time seconds={durationTime} />
			) : (
				<chakra.span>...</chakra.span>
			)}
			{completedIsoDate !== undefined ? (
				//
				<CheckCircleIcon boxSize={30} />
			) : playedIsoDate !== undefined ? (
				<Box data-testid="EpisodeRow-item-playedDate">
					<TimeIcon boxSize={30} />
					<Date isoDate={playedIsoDate} />
				</Box>
			) : null}
		</>
	)
}

export const LatestPage = () => {
	const { refreshAll } = useSubscriptionManager()
	const episodes = useAppSelector(selectRecentEpisodes)

	return (
		<PageStack>
			<Heading as="h1" size="lg">
				Latest episodes
			</Heading>
			<HStack>
				<Button onClick={refreshAll}>Refresh all</Button>
			</HStack>

			<SimpleGrid columns={12} spacing={2} w="full">
				{episodes.map(episode => (
					<EpisodeRow key={episode.item.id} episode={episode} />
				))}
			</SimpleGrid>
		</PageStack>
	)
}
