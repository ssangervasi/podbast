import { useCallback } from 'preact/hooks'

import { clearPull, selectUrlToPull } from '/src/features/rss/slice'
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
			dispatch(fetchFeed({ url: sub.url }))
		})
	}, [dispatch, subscriptions])

	const checkRefresh = useCallback(() => {
		const now = getNow()
		subscriptions.forEach(sub => {
			const diff = now.diff(fromIso(sub.pulledIsoDate))
			if (diff.hours > 1) {
				dispatch(fetchFeed({ url: sub.url }))
			}
		})
	}, [dispatch, subscriptions])

	return { refreshAll, checkRefresh, subscriptions }
}

export const Manager = () => {
	const dispatch = useAppDispatch()

	const { subscriptions, checkRefresh } = useSubscriptionManager()

	const urlToPull = useAppSelector(selectUrlToPull)

	useInterval(
		() => {
			checkRefresh()
		},
		Duration.fromObject({ minutes: 5 }).toMillis(),
		{ immediate: true },
	)

	useInterval(
		() => {
			subscriptions.forEach(sub => {
				const pull = urlToPull[sub.url]
				if (!(pull && pull.status === 'ready' && pull.mode === 'auto')) {
					return
				}

				dispatch(updateSubscriptionFeed(pull.feed))
				dispatch(clearPull(pull.url))
			})
		},
		Duration.fromObject({ seconds: 5 }).toMillis(),
	)
	return <></>
}
