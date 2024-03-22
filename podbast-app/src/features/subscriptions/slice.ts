import { createSelector, createSlice } from '@reduxjs/toolkit'

import { Feed, FeedImage, FeedItem } from '/src/features/rss/guards'
import { compact, wrapEmpty } from '/src/store'
import { log } from '/src/utils'

export type Subscription = {
	// Replicating the feed link to get a canonical website for the podcast
	link: string
	title: string
	// Do I want to replicate the whole thing?
	feed: Feed
}

export type FeedInfo = {
	feedUrl: string
	title: string
	link: string
	image: FeedImage
}

export type SubscriptionsState = Subscription[]

export const initialState: SubscriptionsState = []

export const slice = createSlice({
	name: 'subscriptions',
	initialState,
	reducers: create => ({
		subscribe: create.reducer<Feed>((state, action) => {
			const feed = action.payload
			// Doing this by `link` instead of `feedUrl` might not work out
			const existing = state.find(sub => sub.link === feed.link)
			if (existing) {
				log.error('Repeat feed', feed.link)
				return
			}
			state.push({
				link: feed.link,
				title: feed.title,
				feed,
			})
		}),
		updateSubscriptionFeed: create.reducer<Feed>((state, action) => {
			const feed = action.payload
			const existing = state.find(sub => sub.link === feed.link)
			if (!existing) {
				log.error('Updating feed that is not subscribed', feed.link)
				return
			}

			// Replace whole thing?
			existing.feed = feed
		}),
	}),
	selectors: {
		selectSubscriptions: state => state,
		selectFeedSubscription: (state, link: string) =>
			state.find(sub => sub.link === link),
	},
})

export const { actions, reducer, selectors } = slice
export const { subscribe, updateSubscriptionFeed } = actions
export const { selectSubscriptions, selectFeedSubscription } = selectors

export type SubEp = {
	item: FeedItem
	feed: FeedInfo
}

export const selectRecentEpisodes = createSelector(
	[selectSubscriptions],
	(subs): SubEp[] =>
		compact(
			subs.map(sub => {
				const { feed } = sub
				const item = feed.items[0]
				if (!item) {
					return undefined
				}
				return {
					item,
					feed: {
						title: feed.title,
						image: feed.image,
						link: feed.link,
						feedUrl: feed.feedUrl,
					},
				}
			}),
		),
)

export const selectSubSummaries = createSelector([selectSubscriptions], subs =>
	compact(
		subs.map(sub => ({
			title: sub.title,
			link: sub.link,
		})),
	),
)
