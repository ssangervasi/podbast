import { createSelector, createSlice } from '@reduxjs/toolkit'
import { type Draft } from 'immer'

import { Feed } from '/src/features/rss/guards'
import {
	cmpDate,
	Episode,
	Subscription,
	SubscriptionsState,
	transformFeedToSubscription,
	transformFeedToSubscriptionItems,
} from '/src/features/subscriptions/models'
import { compact, entries, log, values } from '/src/utils'

export const initialState: SubscriptionsState = {
	feedUrlToSubscription: {},
	feedUrlToItemIdToItem: {},
}

export const updateStateFromFeed = (
	draft: Draft<SubscriptionsState>,
	feed: Feed,
): void => {
	const { feedUrl } = feed
	const existing = draft.feedUrlToSubscription[feedUrl]

	if (!existing) {
		log.error('Updating feed that is not subscribed', feed.link)
		return
	}

	const existingItems = draft.feedUrlToItemIdToItem[feedUrl] ?? {}
	draft.feedUrlToItemIdToItem[feedUrl] = existingItems

	const items = transformFeedToSubscriptionItems(feed)
	entries(items).forEach(([id, item]) => {
		existingItems[id] = item
	})
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
				updateStateFromFeed(draft, feed)
				return
			}

			const subscription = transformFeedToSubscription(feed)
			const items = transformFeedToSubscriptionItems(feed)
			draft.feedUrlToSubscription[feedUrl] = subscription
			draft.feedUrlToItemIdToItem[feedUrl] = items
		}),
		updateSubscriptionFeed: create.reducer<Feed>((state, action) => {
			const feed = action.payload
			updateStateFromFeed(state, feed)
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
export const { subscribe, updateSubscriptionFeed } = actions
export const { selectState, selectFeedSubscription } = selectors

export const selectSubscriptions = createSelector(
	[selectState],
	(state): Subscription[] => values(state.feedUrlToSubscription),
)

export const selectRecentEpisodes = createSelector(
	[selectState],
	(state): Episode[] => {
		const items = values(state.feedUrlToItemIdToItem).flatMap(items =>
			values(items).flatMap(item => {
				const { feedUrl } = item
				const subscription = state.feedUrlToSubscription[feedUrl]!
				return {
					subscription,
					item,
				}
			}),
		)
		// Date late to early
		items.sort((a, b) => -cmpDate(a.item.isoDate, b.item.isoDate))
		return items
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
