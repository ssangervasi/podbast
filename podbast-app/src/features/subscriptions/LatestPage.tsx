import { Alert, AlertIcon, Box, Button, Heading } from '@chakra-ui/react'

import { selectPullsByStatus } from '/src/features/rss/slice'
import { useSubscriptionManager } from '/src/features/subscriptions/manager'
import { useAppSelector } from '/src/store'
import { HStack, PageGrid, PageStack } from '/src/ui'

import { EpisodeRow } from './EpisodeRow'
import { selectRecentEpisodes } from './slice'

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

				{notFoundPulls.length > 0 ? (
					<Box>
						<Alert status="error">
							<AlertIcon />
							Some ({notFoundPulls.length}) subscriptions have issues with their
							feed. Check the subscriptions tab for details.
						</Alert>
					</Box>
				) : null}
			</HStack>

			<PageGrid>
				{episodes.map(episode => (
					<EpisodeRow key={episode.item.id} episode={episode} />
				))}
			</PageGrid>
		</PageStack>
	)
}
