import { createSelector, createSlice } from '@reduxjs/toolkit'
import { narrow } from 'narrow-minded'

import { _receiveMediaUpdate as player_receiveMediaUpdate } from '/src/features/player/slice'
import { Feed } from '/src/features/rss/models'
import { compact, isAround, log, sorted, values } from '/src/utils'
import { cmpIsoDate, fromIso, getNow } from '/src/utils/datetime'

import {
	Episode,
	Exportable,
	getFeedKey,
	getPubDate,
	mergeFeedIntoState,
	mergeSubscriptionActivityIntoState,
	Subscription,
	SubscriptionActivity,
	SubscriptionItem,
	SubscriptionItemIndex,
	SubscriptionsState,
	transformFeedToSubscription,
	transformFeedToSubscriptionItems,
} from './models'

export const initialState: SubscriptionsState = {
	feedUrlToSubscription: {},
	feedUrlToItemIdToItem: {},
}

const logger = log.with({ prefix: 'sub slice' })

export const slice = createSlice({
	name: 'subscriptions',
	initialState,
	reducers: create => ({
		subscribe: create.reducer<Feed>((draft, action) => {
			const feed = action.payload
			const feedKey = getFeedKey(feed)
			const existing = draft.feedUrlToSubscription[feedKey]

			if (existing) {
				logger.debug('Subscribe to existing feed', {
					feedKey,
					feedUrl: feed.feedUrl,
				})
				mergeFeedIntoState(draft, feed)
				return
			}

			const subscription = transformFeedToSubscription(feed)
			const items = transformFeedToSubscriptionItems(feed)
			draft.feedUrlToSubscription[feedKey] = subscription
			draft.feedUrlToItemIdToItem[feedKey] = items
		}),

		updateSubscriptionFeed: create.reducer<Feed>((draft, action) => {
			const feed = action.payload
			mergeFeedIntoState(draft, feed)
		}),

		updateActivity: create.reducer<{
			feedKey: string
			activity: SubscriptionActivity
		}>((draft, action) => {
			mergeSubscriptionActivityIntoState(draft, action.payload)
		}),

		markPlayed: create.reducer<SubscriptionItemIndex>((draft, action) => {
			const itemIndex = action.payload

			const item =
				draft.feedUrlToItemIdToItem[itemIndex.feedUrl]?.[itemIndex.id]
			if (!item) {
				logger.error("Couldn't find subscription item from index")
				return
			}

			item.activity.completedIsoDate = getNow().toISO()
		}),

		receiveImport: create.reducer<Exportable>((draft, action) => {
			action.payload.subscriptions.forEach(expSub => {
				if (!expSub.url) {
					return
				}

				const existingSub = draft.feedUrlToSubscription[expSub.feedUrl]
				if (!existingSub) {
					const sub: Subscription = {
						feedKey: expSub.feedKey ?? expSub.feedUrl,
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
				logger.error('Missig itemUpdate')

				return
			}

			const item =
				draft.feedUrlToItemIdToItem[itemUpdate.feedUrl]?.[itemUpdate.id]
			if (!item) {
				logger.error("Couldn't find subscription item from update")
				return
			}

			if (narrow('number', durationTime)) {
				item.activity.durationTime = durationTime
			}

			const prevTime = item.activity.progressTime

			logger.debug('player_receiveMediaUpdate', { prevTime, currentTime })

			// Store first progress
			if (narrow('undefined', prevTime) && narrow('number', currentTime)) {
				logger.debug('First prog')

				item.activity.progressTime = currentTime
				item.activity.playedIsoDate = getNow().toISO()
			}

			// Store subsequent progress
			if (narrow('number', prevTime) && narrow('number', currentTime)) {
				logger.debug('Subseq prog', prevTime)

				item.activity.progressTime = currentTime
				item.activity.playedIsoDate = getNow().toISO()
			}

			// Store completion when the end is reached. (Within 5% of total duration).
			if (narrow('number', currentTime) && narrow('number', durationTime)) {
				if (isAround(currentTime, 0.05 * durationTime, durationTime)) {
					logger.debug('Around end', prevTime)

					item.activity.completedIsoDate = getNow().toISO()
				}
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
	markPlayed,
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
			values(state.feedUrlToItemIdToItem).flatMap(itemIdToItem => {
				const subEps = sortEpisodes(
					values(itemIdToItem).flatMap(item => {
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

const firstItemsByActivity = (
	items: readonly SubscriptionItem[],
): SubscriptionItem[] =>
	sorted(
		items.filter(
			(
				item,
			): item is SubscriptionItem & { activity: { playedIsoDate: string } } =>
				item.activity.playedIsoDate !== undefined,
		),
		(a, b) =>
			cmpIsoDate.desc(
				fromIso(a.activity.playedIsoDate),
				fromIso(b.activity.playedIsoDate),
			),
	).slice(0, 10)

export const selectRecentlyPlayed = createSelector(
	[selectState],
	(state): readonly Episode[] => {
		const episodes = firstItemsByActivity(
			values(state.feedUrlToItemIdToItem).flatMap(itemIdToItem =>
				values(itemIdToItem),
			),
		).map(item => {
			const subscription = state.feedUrlToSubscription[item.feedUrl]!
			return {
				subscription,
				item,
			}
		})

		return episodes
	},
)

export const selectSubSummaries = createSelector([selectSubscriptions], subs =>
	sorted(subs, (sl, sr) => (sl.title < sr.title ? -1 : 1)),
)

// I need a way to produce stable results even when the activity keeps updating the state. Ideas:
// - Split the activity out of the items objects
// - Create some kind of hash identifier of the array
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
					values(state.feedUrlToItemIdToItem[sub.feedKey] ?? {}).map(item => {
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
