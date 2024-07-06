import { CheckCircleIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, chakra, GridItem, Text } from '@chakra-ui/react'

import {
	Episode,
	SubscriptionItemActivity,
} from '/src/features/subscriptions/models'
import { SubscriptionTitle } from '/src/features/subscriptions/SubscriptionTitle'
import { HCenter, RowWrapper } from '/src/ui'
import { ExpandableLines } from '/src/ui/ExpandableLines'
import { DateView, TimeView } from '/src/ui/units'

import { EpisodeControls } from './EpisodeControls'

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
