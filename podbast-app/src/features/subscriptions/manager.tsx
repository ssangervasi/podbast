import { useCallback } from 'preact/hooks'

import { useLayout } from '/src/features/layout/useLayout'
import { clearPull, selectUrlToPull } from '/src/features/rss/slice'
import { fetchFeed } from '/src/features/rss/thunks'
import { useAppDispatch, useAppSelector } from '/src/store'
import { log, useInterval } from '/src/utils'
import { Duration, fromIso, getEpoch, getNow } from '/src/utils/datetime'

import {
	selectFeedUrlToSubscription,
	selectSubscriptions,
	updateActivity,
	updateSubscriptionFeed,
} from './slice'

const logger = log.with({ prefix: 'sub manager' })

export const useSubscriptionManager = () => {
	const dispatch = useAppDispatch()
	const feedUrlToSubscription = useAppSelector(selectFeedUrlToSubscription)
	const subscriptions = useAppSelector(selectSubscriptions)

	const refreshOne = useCallback(
		({ feedUrl }: { feedUrl: string }) => {
			const sub = feedUrlToSubscription[feedUrl]!
			dispatch(fetchFeed({ url: sub.url }))
		},
		[dispatch, feedUrlToSubscription],
	)

	const refreshAll = useCallback(() => {
		subscriptions.forEach(sub => {
			dispatch(fetchFeed({ url: sub.url }))
		})
	}, [dispatch, subscriptions])

	const checkRefresh = useCallback(() => {
		const now = getNow()

		logger.debug('checkRefresh', now)

		subscriptions.forEach(sub => {
			const diff = now.diff(fromIso(sub.pulledIsoDate))
			if (diff.hours > 1) {
				dispatch(fetchFeed({ url: sub.url }))
			}
		})
	}, [dispatch, subscriptions])

	return { refreshAll, refreshOne, checkRefresh, subscriptions }
}

export const Manager = () => {
	const dispatch = useAppDispatch()
	const { onLayout } = useLayout()

	const { subscriptions, checkRefresh, refreshOne } = useSubscriptionManager()

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

				if (
					!(
						(pull && pull.status === 'ready')
						// && pull.mode === 'auto'
					)
				) {
					return
				}

				dispatch(updateSubscriptionFeed(pull.feed))
				dispatch(clearPull(pull.url))
			})
		},
		Duration.fromObject({ seconds: 10 }).toMillis(),
	)

	onLayout('subscriptionDetails', layoutData => {
		logger('>>>> onLayout')
		const { feedUrl } = layoutData
		dispatch(
			updateActivity({
				feedUrl,
				activity: {
					catalogueIsoDate: getEpoch().toISODate(),
				},
			}),
		)

		refreshOne({ feedUrl })
	})

	return <></>
}
