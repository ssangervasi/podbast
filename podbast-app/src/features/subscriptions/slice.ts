import { createSelector, createSlice } from '@reduxjs/toolkit'

import type { MediaUpdate } from '/src/features/player/slice'
import { Feed } from '/src/features/rss/models'
import { compact, log, values } from '/src/utils'
import { getNow } from '/src/utils/datetime'

import {
	cmpDate,
	Episode,
	Exportable,
	mergeFeedIntoState,
	Subscription,
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
		_receiveMediaUpdate: create.reducer<MediaUpdate>((draft, action) => {
			const {
				//
				media: { item: itemUpdate, currentTime } = {},
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

			item.activity.progressTime = currentTime
			item.activity.playedIsoDate = getNow().toISO()
		}),
		receiveImport: create.reducer<Exportable>((draft, action) => {
			action.payload.subscriptions.forEach(expSub => {
				const existingSub = draft.feedUrlToSubscription[expSub.feedUrl]
				if (!existingSub) {
					const sub: Subscription = {
						feedUrl: expSub.feedUrl,
						link: expSub.link,
						title: expSub.title,
						description: expSub.description,
						isoDate: expSub.isoDate,
						pulledIsoDate: expSub.pulledIsoDate,
						image: (expSub as any)?.image,
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
	_receiveMediaUpdate,
	receiveImport,
} = actions
export const {
	selectState,
	selectFeedSubscription,
	selectFeedUrlToSubscription,
} = selectors

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

export const selectExportableSubscriptions = createSelector(
	[selectState],
	state => {
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
					...sub,
					items,
				}
			}),
		)
	},
)
