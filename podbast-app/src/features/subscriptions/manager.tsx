import { useCallback, useEffect } from 'preact/hooks'

import { fetchFeed } from '/src/features/rss/thunks'
import { useAppDispatch, useAppSelector } from '/src/store'
import { log } from '/src/utils'

import { selectSubscriptions } from './slice'

export const useSubscriptionManager = () => {
	const dispatch = useAppDispatch()
	const subscriptions = useAppSelector(selectSubscriptions)

	const refresh = useCallback(() => {
		subscriptions.forEach(sub => {
			log.info('refreshing', sub.feed.feedUrl)
			dispatch(fetchFeed({ feedUrl: sub.feed.feedUrl }))
		})
	}, [dispatch, subscriptions])

	return { refresh }
}
export const Manager = () => {
	const subscriptions = useAppSelector(selectSubscriptions)

	useEffect(() => {
		log.info('subscriptions changed')
	}, [subscriptions])

	return <></>
}
