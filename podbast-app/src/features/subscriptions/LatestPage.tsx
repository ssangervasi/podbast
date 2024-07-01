import { Alert, AlertIcon, Box, Button, Heading } from '@chakra-ui/react'

import { selectPullsByStatus } from '/src/features/rss/slice'
import { useSubscriptionManager } from '/src/features/subscriptions/manager'
import { useAppSelector } from '/src/store'
import { HStack, PageGrid, PageStack } from '/src/ui'

import { EpisodeRow } from './EpisodeView'
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
