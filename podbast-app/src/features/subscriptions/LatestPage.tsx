import { CheckCircleIcon, TimeIcon } from '@chakra-ui/icons'
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	chakra,
	GridItem,
	Heading,
	Text,
} from '@chakra-ui/react'

import { selectPullsByStatus } from '/src/features/rss/slice'
import { useSubscriptionManager } from '/src/features/subscriptions/manager'
import {
	Episode,
	SubscriptionItemActivity,
} from '/src/features/subscriptions/models'
import { SubscriptionTitle } from '/src/features/subscriptions/SubscriptionTitle'
import { useAppSelector } from '/src/store'
import { HCenter, HStack, PageGrid, PageStack, RowWrapper } from '/src/ui'
import { ExpandableLines } from '/src/ui/ExpandableLines'
import { DateView, TimeView } from '/src/ui/units'

import { EpisodeControls } from './EpisodeControls'
import { selectRecentEpisodes } from './slice'

export const EpisodeRow = ({ episode }: { episode: Episode }) => (
	<>
		<RowWrapper>
			<GridItem colSpan={2}>
				<SubscriptionTitle subscription={episode.subscription} />

				<DateView isoDate={episode.item.isoDate} />
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
					<TimeView seconds={progressTime} />
					<chakra.span>{' /\n'}</chakra.span>
				</>
			) : null}
			{durationTime !== undefined ? (
				<TimeView seconds={durationTime} />
			) : (
				<chakra.span>...</chakra.span>
			)}
			{completedIsoDate !== undefined ? (
				//
				<CheckCircleIcon boxSize={30} />
			) : playedIsoDate !== undefined ? (
				<Box data-testid="EpisodeRow-item-playedDate">
					<TimeIcon boxSize={30} />
					<DateView isoDate={playedIsoDate} />
				</Box>
			) : null}
		</>
	)
}

export const LatestPage = () => {
	const { refreshAll } = useSubscriptionManager()
	const episodes = useAppSelector(selectRecentEpisodes)
	const requestedPulls = useAppSelector(state =>
		selectPullsByStatus(state, 'requested'),
	)
	const notFoundPulls = useAppSelector(state =>
		selectPullsByStatus(state, 'notFound'),
	)

	const anyLoading = requestedPulls.length > 0

	return (
		<PageStack>
			<Heading as="h1">Latest episodes</Heading>
			<HStack>
				<Button onClick={refreshAll} isLoading={anyLoading}>
					Refresh all
				</Button>
			</HStack>

			{notFoundPulls.length > 0 ? (
				<Box>
					<Alert status="error">
						<AlertIcon />
						Some feeds could not be pulled:{' '}
						{notFoundPulls.map(pull => JSON.stringify(pull.url)).join(', ')}
					</Alert>
				</Box>
			) : null}

			<PageGrid>
				{episodes.map(episode => (
					<EpisodeRow key={episode.item.id} episode={episode} />
				))}
			</PageGrid>
		</PageStack>
	)
}
