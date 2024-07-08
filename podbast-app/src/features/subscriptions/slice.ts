import { createSelector, createSlice } from '@reduxjs/toolkit'
import { narrow } from 'narrow-minded'

import { _receiveMediaUpdate as player_receiveMediaUpdate } from '/src/features/player/slice'
import { Feed } from '/src/features/rss/models'
import { compact, isAround, log, sorted, values } from '/src/utils'
import { cmpIsoDate, getNow } from '/src/utils/datetime'

import {
	Episode,
	Exportable,
	getPubDate,
	mergeFeedIntoState,
	mergeSubscriptionActivityIntoState,
	Subscription,
	SubscriptionActivity,
	SubscriptionItem,
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

		updateSubscriptionFeed: create.reducer<Feed>((draft, action) => {
			const feed = action.payload
			mergeFeedIntoState(draft, feed)
		}),

		updateActivity: create.reducer<{
			feedUrl: string
			activity: SubscriptionActivity
		}>((draft, action) => {
			mergeSubscriptionActivityIntoState(draft, action.payload)
		}),

		receiveImport: create.reducer<Exportable>((draft, action) => {
			action.payload.subscriptions.forEach(expSub => {
				if (!expSub.url) {
					return
				}

				const existingSub = draft.feedUrlToSubscription[expSub.feedUrl]
				if (!existingSub) {
					const sub: Subscription = {
						feedUrl: expSub.feedUrl,
						url: expSub.url,
						link: (expSub as any)?.link,
						title: expSub.title,
						description: expSub.description,
						isoDate: expSub.isoDate,
						pulledIsoDate: expSub.pulledIsoDate,
						image: expSub.image as any,
						activity: (expSub as any)?.activity ?? {},
					}
					draft.feedUrlToSubscription[expSub.feedUrl] = sub
				}

				const existingIt = draft.feedUrlToItemIdToItem[expSub.feedUrl]
				if (!existingIt) {
					draft.feedUrlToItemIdToItem[expSub.feedUrl] = {}
				}

				expSub.items.forEach(expItem => {
					const itemIdToItem = draft.feedUrlToItemIdToItem[expSub.feedUrl]!
					const item = expItem as SubscriptionItem
					itemIdToItem[item.id] = item
				})
			})
		}),
	}),

	extraReducers: builder => {
		builder.addCase(player_receiveMediaUpdate, (draft, action) => {
			const {
				//
				media: { item: itemUpdate, currentTime, durationTime } = {},
			} = action.payload
			if (!itemUpdate) {
				return
			}

			const item =
				draft.feedUrlToItemIdToItem[itemUpdate.feedUrl]?.[itemUpdate.id]
			if (!item) {
				log.error("Couldn't find subscription item from update")
				return
			}

			if (durationTime) {
				item.activity.durationTime = durationTime
			}

			const prevTime = item.activity.progressTime

			// Store first progress
			if (narrow('undefined', prevTime) && narrow('number', currentTime)) {
				item.activity.progressTime = currentTime
				item.activity.playedIsoDate = getNow().toISO()
				return
			}

			// Store subsequent progress
			if (narrow('number', prevTime) && narrow('number', currentTime)) {
				// Only store 10 second fidelity
				if (isAround(prevTime, 10, currentTime)) {
					return
				}

				item.activity.progressTime = currentTime
				item.activity.playedIsoDate = getNow().toISO()
			}
		})
	},
	selectors: {
		selectState: state => state,
		selectFeedSubscription: (state, feedUrl: string) =>
			state.feedUrlToSubscription[feedUrl],
		selectFeedUrlToSubscription: state => state.feedUrlToSubscription,
	},
})

export const { actions, reducer, selectors } = slice
export const {
	subscribe,
	updateSubscriptionFeed,
	receiveImport,
	updateActivity,
} = actions
export const {
	selectState,
	selectFeedSubscription,
	selectFeedUrlToSubscription,
} = selectors

export const selectSubscriptions = createSelector(
	[selectState],
	(state): readonly Subscription[] => values(state.feedUrlToSubscription),
)

/**
 * Latest to oldest
 */

const cmpItems = (a: SubscriptionItem, b: SubscriptionItem) =>
	cmpIsoDate.desc(getPubDate(a), getPubDate(b))

const sortItems = (item: readonly SubscriptionItem[]) => sorted(item, cmpItems)

const sortEpisodes = (episodes: Episode[]) =>
	sorted(episodes, (a, b) => cmpItems(a.item, b.item))

export const selectRecentEpisodes = createSelector(
	[selectState],
	(state): readonly Episode[] =>
		sortEpisodes(
			values(state.feedUrlToItemIdToItem).flatMap(items => {
				const subEps = sortEpisodes(
					values(items).flatMap(item => {
						const { feedUrl } = item
						const subscription = state.feedUrlToSubscription[feedUrl]!
						return {
							subscription,
							item,
						}
					}),
				)

				return subEps.slice(0, 2)
			}),
		),
)

export const selectSubSummaries = createSelector([selectSubscriptions], subs =>
	sorted(subs, (sl, sr) => (sl.title < sr.title ? -1 : 1)),
)

export const selectSubscriptionWithItems = createSelector(
	[selectState, (_, feedUrl: string) => feedUrl],
	(state, feedUrl) => {
		const sub = state.feedUrlToSubscription[feedUrl]
		if (!sub) {
			throw new Error('Not found')
		}

		const items = sortItems(
			values(state.feedUrlToItemIdToItem[sub.feedUrl] ?? {}),
		)

		return {
			...sub,
			items,
		}
	},
)

export const selectExportableSubscriptions = createSelector(
	[selectState],
	(state): Exportable['subscriptions'] => {
		return compact(
			values(state.feedUrlToSubscription).map(sub => {
				const items = compact(
					values(state.feedUrlToItemIdToItem[sub.feedUrl] ?? {}).map(item => {
						const { playedIsoDate } = item.activity
						if (!playedIsoDate) {
							return undefined
						}
						return item
					}),
				)

				return {
					link: undefined,
					image: undefined,
					...sub,
					items,
				}
			}),
		)
	},
)
