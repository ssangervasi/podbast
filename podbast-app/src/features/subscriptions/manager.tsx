import { useCallback, useEffect } from 'preact/hooks'

import { selectFeedUrlToPull } from '/src/features/rss/slice'
import { fetchFeed } from '/src/features/rss/thunks'
import { useAppDispatch, useAppSelector } from '/src/store'
import { useInterval } from '/src/utils'
import { Duration, fromIso, getNow } from '/src/utils/datetime'

import { selectSubscriptions, updateSubscriptionFeed } from './slice'

export const useSubscriptionManager = () => {
	const dispatch = useAppDispatch()
	const subscriptions = useAppSelector(selectSubscriptions)

	const refreshAll = useCallback(() => {
		subscriptions.forEach(sub => {
			dispatch(fetchFeed({ feedUrl: sub.feedUrl }))
		})
	}, [dispatch, subscriptions])

	const checkRefresh = useCallback(() => {
		const now = getNow()
		subscriptions.forEach(sub => {
			const diff = now.diff(fromIso(sub.pulledIsoDate))
			if (diff.hours > 1) {
				dispatch(fetchFeed({ feedUrl: sub.feedUrl }))
			}
		})
	}, [dispatch, subscriptions])

	return { refreshAll, checkRefresh, subscriptions }
}

export const Manager = () => {
	const dispatch = useAppDispatch()

	const { subscriptions, checkRefresh } = useSubscriptionManager()

	const feedUrlToPull = useAppSelector(selectFeedUrlToPull)

	useEffect(() => {
		subscriptions.forEach(sub => {
			const pull = feedUrlToPull.get(sub.feedUrl)
			if (!(pull && pull.status === 'ready')) {
				return
			}
			dispatch(updateSubscriptionFeed(pull.feed))
		})
	}, [feedUrlToPull])

	useInterval(
		() => {
			checkRefresh
		},
		Duration.fromObject({ minutes: 5 }).toMillis(),
		{ immediate: true },
	)

	return <></>
}
