import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'

import { Feed, FeedImage, FeedItem } from '/src/features/rss/guards'
import { compact, wrapEmpty } from '/src/store'
import { RootState } from '/src/store/store'

export type Subscription = {
	url: string
	title: string
	// Do I want to replicate the whole thing?
	feed: Feed
}

export type FeedInfo = {
	feedUrl: string
	title: string
	image: FeedImage
}

export type SubscriptionsState = Subscription[]

export const initialState: SubscriptionsState = []

export const slice = createSlice({
	name: 'subscriptions',
	initialState,
	reducers: create => ({
		// subscribe: create.reducer<{ feedUrl: string }>((state, action) => {
		// 	// state.
		// 	state.push(action.payload)
		// }),
		subscribe: create.asyncThunk(
			//
			async ({ feedUrl: string }, thunkApi) => {
				const x = thunkApi.getState() as RootState
			},
			{
				fulfilled: (state, action) => {
					state.push(action.payload)
				},
			},
		),
	}),
	selectors: {
		selectSubscriptions: state => state,
		selectFeedSubscription: (state, url: string) =>
			state.find(sub => sub.url === url),
	},
})

export const { actions, reducer, selectors } = slice
export const { subscribe } = actions
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
				return {
					item,
					feed: {
						title: feed.title,
						image: feed.image,
						feedUrl: feed.feedUrl,
					},
				}
			}),
		),
)
