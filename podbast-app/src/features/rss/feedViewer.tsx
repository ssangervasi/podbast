import { Button, chakra, HStack, List, ListItem, Text } from '@chakra-ui/react'
import { Suspense } from 'preact/compat'
import { useCallback } from 'preact/hooks'

import { play } from '/src/features/player'
import { Feed, FeedItem } from '/src/features/rss/guards'
import { selectFeedSubscription, subscribe } from '/src/features/subscriptions'
import { useAppDispatch, useAppSelector } from '/src/store'
import { VStack } from '/src/ui'
import { useChunker } from '/src/utils/use-chunker'

export const FeedViewer = ({ feed }: { feed: Feed }) => {
	const dispatch = useAppDispatch()
	const subscription = useAppSelector(state =>
		selectFeedSubscription(state, feed.feedUrl),
	)
	const isSubscribed = Boolean(subscription)

	const handleSubscribe = useCallback(() => {
		dispatch(
			subscribe({
				title: feed.title,
				url: feed.feedUrl,
			}),
		)
	}, [feed])

	const chunker = useChunker({ items: feed.items })

	return (
		<VStack maxWidth={['full', 'container.lg']}>
			<chakra.b fontSize="large">{feed.title}</chakra.b>

			<HStack>
				<Button size="sm" onClick={handleSubscribe} isDisabled={isSubscribed}>
					{isSubscribed ? 'Subscribed' : 'Subscribe'}
				</Button>
			</HStack>

			<chakra.span>{feed.description}</chakra.span>

			<chakra.b>Episodes</chakra.b>
			<Suspense fallback={<chakra.span>...</chakra.span>}>
				<List spacing={2}>
					{chunker.chunk.map(item => (
						<ListItem key={item.guid}>
							<FeedItemViewer item={item} />
						</ListItem>
					))}
				</List>
			</Suspense>
		</VStack>
	)
}

export const FeedItemViewer = ({ item }: { item: FeedItem }) => {
	const dispatch = useAppDispatch()

	return (
		<HStack borderTopColor="gray.700" borderTopWidth={1} padding={1}>
			<Button
				size="sm"
				onClick={() => {
					dispatch(
						play({
							title: item.title,
							url: item.enclosure.url,
						}),
					)
				}}
			>
				▶
			</Button>
			<VStack spacing={1}>
				<chakra.i>{item.title}</chakra.i>
				<chakra.span fontSize="md" noOfLines={1}>
					{item.contentSnippet}
				</chakra.span>
			</VStack>
		</HStack>
	)
}
