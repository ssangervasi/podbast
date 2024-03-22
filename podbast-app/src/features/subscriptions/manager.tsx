import { useCallback, useEffect } from 'preact/hooks'

import { selectFeedUrlToPull } from '/src/features/rss/slice'
import { fetchFeed } from '/src/features/rss/thunks'
import { useAppDispatch, useAppSelector } from '/src/store'
import { log } from '/src/utils'

import { selectSubscriptions, updateSubscriptionFeed } from './slice'

export const useSubscriptionManager = () => {
	const dispatch = useAppDispatch()
	const subscriptions = useAppSelector(selectSubscriptions)

	const refresh = useCallback(() => {
		subscriptions.forEach(sub => {
			dispatch(fetchFeed({ feedUrl: sub.feed.feedUrl }))
		})
	}, [dispatch, subscriptions])

	return { refresh, subscriptions }
}
export const Manager = () => {
	const dispatch = useAppDispatch()

	const { subscriptions } = useSubscriptionManager()

	const feedUrlToPull = useAppSelector(selectFeedUrlToPull)

	useEffect(() => {
		log.info('pulls changed')
		subscriptions.forEach(sub => {
			const pull = feedUrlToPull.get(sub.feed.feedUrl)
			if (!(pull && pull.status === 'ready')) {
				return
			}
			dispatch(updateSubscriptionFeed(pull.feed))
		})
	}, [feedUrlToPull])

	useEffect(() => {
		log.info('subscriptions changed')
	}, [subscriptions])

	return <></>
}
