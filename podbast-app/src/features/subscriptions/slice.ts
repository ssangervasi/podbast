import { createSelector, createSlice } from '@reduxjs/toolkit'

import { Feed } from '/src/features/rss/models'
import { compact, log, values } from '/src/utils'

import {
	cmpDate,
	Episode,
	mergeFeedIntoState,
	Subscription,
	SubscriptionsState,
	transformFeedToSubscription,
	transformFeedToSubscriptionItems,
} from './models'

export const initialState: SubscriptionsState = {
	feedUrlToSubscription: {},
	feedUrlToItemIdToItem: {},
}

export const slice = createSlice({
	name: 'subscriptions',
	initialState,
	reducers: create => ({
		subscribe: create.reducer<Feed>((draft, action) => {
			const feed = action.payload
			const { feedUrl } = feed
			const existing = draft.feedUrlToSubscription[feedUrl]

			if (existing) {
				log.info('Subscribe to existing feed', feed.feedUrl)
				mergeFeedIntoState(draft, feed)
				return
			}

			const subscription = transformFeedToSubscription(feed)
			const items = transformFeedToSubscriptionItems(feed)
			draft.feedUrlToSubscription[feedUrl] = subscription
			draft.feedUrlToItemIdToItem[feedUrl] = items
		}),
		updateSubscriptionFeed: create.reducer<Feed>((state, action) => {
			const feed = action.payload
			mergeFeedIntoState(state, feed)
		}),
		_receiveMediaUpdate: create.reducer<{
			url: string
			currentTime?: number
		}>((state, action) => {
			// state
			log.info('subs _receiveMediaUpdate', action)
		}),
	}),
	selectors: {
		selectState: state => state,
		selectFeedSubscription: (state, feedUrl: string) =>
			state.feedUrlToSubscription[feedUrl],
		selectFeedUrlToSubscription: state => state.feedUrlToSubscription,
	},
})

export const { actions, reducer, selectors } = slice
export const { subscribe, updateSubscriptionFeed, _receiveMediaUpdate } =
	actions
export const { selectState, selectFeedSubscription } = selectors

export const selectSubscriptions = createSelector(
	[selectState],
	(state): Subscription[] => values(state.feedUrlToSubscription),
)

/**
 * Latest to oldest, in-place
 */
const sortEpisodes = (episodes: Episode[]): void => {
	episodes.sort((a, b) => -cmpDate(a.item.isoDate, b.item.isoDate))
}

export const selectRecentEpisodes = createSelector(
	[selectState],
	(state): Episode[] => {
		const eps = values(state.feedUrlToItemIdToItem).flatMap(items => {
			const subEps = values(items).flatMap(item => {
				const { feedUrl } = item
				const subscription = state.feedUrlToSubscription[feedUrl]!
				return {
					subscription,
					item,
				}
			})
			sortEpisodes(subEps)
			subEps.splice(2, Infinity)
			return subEps
		})
		sortEpisodes(eps)
		return eps
	},
)

export const selectSubSummaries = createSelector([selectSubscriptions], subs =>
	compact(
		subs.map(sub => ({
			title: sub.title,
			link: sub.link,
		})),
	),
)
