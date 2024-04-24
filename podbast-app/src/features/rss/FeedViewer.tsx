import { Button, chakra, GridItem, Spinner } from '@chakra-ui/react'
import { useCallback } from 'preact/hooks'

import { makeRequest } from '/src/features/player'
import {
	RssPull,
	RssPullNotFound,
	RssPullReady,
	RssPullRequested,
} from '/src/features/rss/slice'
import { selectFeedSubscription, subscribe } from '/src/features/subscriptions'
import { useAppDispatch, useAppSelector } from '/src/store'
import { RowWrapper, VStack } from '/src/ui'
import { useChunker } from '/src/utils/useChunker'

import { FeedItem } from './models'

export const PullViewer = ({ pull }: { pull: RssPull }) => {
	return pull.status === 'requested' ? (
		<FeedRequested pull={pull} />
	) : pull.status === 'ready' ? (
		<FeedViewer pull={pull} />
	) : (
		<FeedNotFound pull={pull} />
	)
}

const FeedRequested = ({ pull }: { pull: RssPullRequested }) => {
	return (
		<>
			<GridItem colSpan={2}>
				<Spinner />
			</GridItem>

			<GridItem colSpan={10}>
				<chakra.span fontFamily="monospace">{pull.url}</chakra.span>
			</GridItem>
		</>
	)
}
const FeedNotFound = ({ pull }: { pull: RssPullNotFound }) => {
	return (
		<>
			<GridItem colSpan={2}>Feed not found 😒</GridItem>

			<GridItem colSpan={10}>
				<chakra.span fontFamily="monospace">{pull.url}</chakra.span>
			</GridItem>
		</>
	)
}

const FeedViewer = ({ pull }: { pull: RssPullReady }) => {
	const { feed, status: _status, url: _requestedUrl } = pull

	const dispatch = useAppDispatch()
	const subscription = useAppSelector(state =>
		selectFeedSubscription(state, feed.feedUrl),
	)
	const isSubscribed = Boolean(subscription)

	const handleSubscribe = useCallback(() => {
		dispatch(subscribe(feed))
	}, [feed])

	const chunker = useChunker({ items: feed.items })

	return (
		<>
			<RowWrapper>
				<GridItem colSpan={2}>
					<chakra.b fontSize="lg">{feed.title}</chakra.b>
				</GridItem>

				<GridItem colSpan={2} data-testid="EpisodeRow-item-title">
					<Button size="sm" onClick={handleSubscribe}>
						{isSubscribed ? 'Subscribed' : 'Subscribe'}
					</Button>
				</GridItem>

				<GridItem colSpan={6}>
					<chakra.span>{feed.description}</chakra.span>
				</GridItem>

				<GridItem colSpan={2}>
					<chakra.span fontFamily="monospace">{feed.feedUrl}</chakra.span>
				</GridItem>
			</RowWrapper>

			<RowWrapper>
				<GridItem colSpan={12}>
					<chakra.b>Episodes</chakra.b>
				</GridItem>

				{chunker.chunk.map(item => (
					<FeedItemViewer item={item} key={item.guid} />
				))}

				{chunker.itemsAfter > 0 ? (
					<GridItem colSpan={12}>... and {chunker.itemsAfter} more</GridItem>
				) : null}
			</RowWrapper>
		</>
	)
}

const FeedItemViewer = ({ item }: { item: FeedItem }) => {
	const dispatch = useAppDispatch()

	return (
		<RowWrapper>
			<GridItem colSpan={10}>
				<VStack spacing={1}>
					<chakra.i>{item.title}</chakra.i>
					<chakra.span fontSize="md" noOfLines={1}>
						{item.contentSnippet}
					</chakra.span>
				</VStack>
			</GridItem>

			<GridItem colSpan={2}>
				<Button
					size="sm"
					onClick={() => {
						dispatch(
							makeRequest({
								status: 'playing',
								media: {
									title: item.title,
									src: item.enclosure.url,
								},
							}),
						)
					}}
				>
					▶
				</Button>
			</GridItem>
		</RowWrapper>
	)
}
