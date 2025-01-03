import { useCallback, useEffect } from 'preact/hooks'

import { useLayout } from '/src/features/layout/useLayout'
import { clearPull } from '/src/features/rss/slice'
import { fetchFeed } from '/src/features/rss/thunks'
import { useAppDispatch, useAppSelector } from '/src/store'
import { addAppListener } from '/src/store/listener'
import { isDev, log, useInterval } from '/src/utils'
import { Duration, fromIso, getEpoch, getNow } from '/src/utils/datetime'

import {
	selectFeedUrlToSubscription,
	selectSubscriptions,
	updateActivity,
	updateSubscriptionFeed,
} from './slice'

const logger = log.with({ prefix: 'SubscriptionManager' })

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
		if (isDev()) {
			logger.debug('skipping auto refresh in dev')
			return
		}

		const now = getNow()

		subscriptions.forEach(sub => {
			const diff = now.diff(fromIso(sub.pulledIsoDate))

			if (diff.as('hours') > 1) {
				dispatch(fetchFeed({ url: sub.url }))
			}
		})
	}, [dispatch, subscriptions])

	return { refreshAll, refreshOne, checkRefresh, subscriptions }
}

export const Manager = () => {
	const dispatch = useAppDispatch()
	const { onLayout } = useLayout()

	const { checkRefresh, refreshOne } = useSubscriptionManager()

	useInterval(
		() => {
			checkRefresh()
		},
		Duration.fromObject({ minutes: 5 }).toMillis(),
		{ immediate: true },
	)

	useEffect(() => {
		// Listener middleware is cool - respond directly to the action. It's possible this could move
		// into the subscriptions reducer and avoid the interaction between store and this component,
		// but this works.
		return dispatch(
			addAppListener({
				predicate: fetchFeed.fulfilled.match,
				effect: action => {
					const { mode = 'auto' } = action.meta.arg
					const feed = action.payload
					if (mode === 'manual') {
						return
					}

					dispatch(updateSubscriptionFeed(feed))
					dispatch(clearPull(feed.url!))
					return
				},
			}),
		)
	}, [])

	onLayout('subscriptionDetails', layoutData => {
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
