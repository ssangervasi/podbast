import { CheckCircleIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, chakra, GridItem, Text, Tooltip } from '@chakra-ui/react'
import { memo } from 'preact/compat'

import {
	Episode,
	SubscriptionItemActivity,
} from '/src/features/subscriptions/models'
import { SubscriptionTitle } from '/src/features/subscriptions/SubscriptionTitle'
import { HCenter, HStack, RowWrapper, VStack } from '/src/ui'
import { ExpandableLines } from '/src/ui/ExpandableLines'
import { DateView, TimeView } from '/src/ui/units'

import { EpisodeControls } from './EpisodeControls'
import { EpisodePlayButton } from './EpisodePlayButton'

export const EpisodeRow = memo(
	({ episode }: { episode: Episode }) => (
		<>
			<RowWrapper>
				<GridItem colSpan={1}>
					<EpisodePlayButton episode={episode} />
				</GridItem>

				<GridItem colSpan={2}>
					<SubscriptionTitle subscription={episode.subscription} />

					<DateView isoDate={episode.item.isoDate} />
				</GridItem>

				<GridItem colSpan={2} data-testid="EpisodeRow-item-title">
					<Text maxW="40ch" noOfLines={3} fontStyle="italic">
						{episode.item.title}
					</Text>
				</GridItem>

				<GridItem colSpan={4}>
					<HCenter>
						<ExpandableLines maxW="40ch" noOfLines={2}>
							{episode.item.contentSnippet}
						</ExpandableLines>
					</HCenter>
				</GridItem>

				<GridItem colSpan={2}>
					<EpisodeActivity activity={episode.item.activity} />
				</GridItem>

				<GridItem colSpan={1}>
					<EpisodeControls episode={episode} />
				</GridItem>
			</RowWrapper>
		</>
	),
	// The list is rebuilt whenever one of them changes. Annoying, but this helps.
	// ... except when I first added this I had it doing the opposite (wrong) check so it was
	// rerending the stuff that didn't change and freezing the stuff that did.
	(oldProps, newProps) =>
		oldProps.episode.item === newProps.episode.item &&
		oldProps.episode.item.activity === newProps.episode.item.activity,
)

const EpisodeActivity = ({
	activity,
}: {
	activity: SubscriptionItemActivity
}) => {
	const { durationTime, progressTime, completedIsoDate, playedIsoDate } =
		activity

	return (
		<HStack gap={4} flexWrap="wrap">
			<VStack>
				{progressTime !== undefined ? (
					<Tooltip label="Progress">
						<Box>
							<TimeView seconds={progressTime} />
							<chakra.span>{' / '}</chakra.span>
						</Box>
					</Tooltip>
				) : null}

				{durationTime !== undefined ? (
					<Tooltip label="Duration">
						<Box>
							<TimeView seconds={durationTime} />
						</Box>
					</Tooltip>
				) : (
					<chakra.span>...</chakra.span>
				)}
			</VStack>

			<VStack flexShrink={1}>
				{completedIsoDate !== undefined ? (
					<HStack data-testid="EpisodeRow-item-completedDate">
						<CheckCircleIcon color="green.300" boxSize="14px" />
						<DateView isoDate={completedIsoDate} />
					</HStack>
				) : null}

				{playedIsoDate !== undefined ? (
					<Tooltip label="Date listened">
						<HStack data-testid="EpisodeRow-item-playedDate">
							<TimeIcon color="yellow.300" boxSize="14px" />
							<DateView isoDate={playedIsoDate} />
						</HStack>
					</Tooltip>
				) : null}
			</VStack>
		</HStack>
	)
}
