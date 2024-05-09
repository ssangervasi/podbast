import { type Draft } from 'immer'
import { Guard, Payload } from 'narrow-minded'
import { ReadonlyDeep } from 'type-fest'

import { Feed, FeedItem } from '/src/features/rss'
import { entries, log } from '/src/utils'
import { compact, Indexed, mapToIndexed, sorted } from '/src/utils/collections'
import {
	cmpIsoDate,
	fromIso,
	getEpoch,
	getNow,
	parseDate,
	parseDurationToSeconds,
} from '/src/utils/datetime'

export type Subscription = {
	/**
	 * Unique ID
	 */
	feedUrl: string

	/**
	 * URL provided by the user, which may include auth params
	 */
	url: string

	/**
	 * Canonical website for the podcast
	 */
	link: string
	title: string
	description: string

	/**
	 * Published date
	 */
	isoDate: string
	/**
	 * Pulled date
	 */
	pulledIsoDate: string

	image?: {
		url: string
		title: string
		link: string
	}
}

export type SubscriptionItem = {
	/**
	 * Parent's ID.
	 */
	feedUrl: string
	/**
	 * Unique ID.
	 * Set to the `guid` if present, otherwise uses `enclosure.url`.
	 */
	id: string
	/**
	 * Usually this is present and can be used as the `id`.
	 */
	guid?: string

	title: string
	link: string
	enclosure: {
		url: string
		length: string
		type: string
	}
	contentSnippet?: string
	/**
	 * Published date.
	 */
	isoDate: string
	activity: SubscriptionItemActivity
}

export type SubscriptionItemActivity = {
	/**
	 * Duration may be included in the feed's itunes data, but otherwise it has to be determined at
	 * playtime.
	 */
	durationTime?: number
	progressTime?: number
	playedIsoDate?: string
	completedIsoDate?: string
}

export type Episode = {
	subscription: Subscription
	item: SubscriptionItem
}

export type SubscriptionsState = {
	feedUrlToSubscription: Indexed<Subscription>
	feedUrlToItemIdToItem: Indexed<Indexed<SubscriptionItem>>
}

export const getFeedItemId = (feedItem: FeedItem): string =>
	feedItem.guid ?? feedItem.enclosure.url

export const getFeedItemIsoDate = (feedItem: FeedItem): string =>
	feedItem.isoDate ?? parseDate(feedItem.pubDate).toISO()

export const transformFeedItemToSubscriptionItem = (
	feed: Feed,
	feedItem: FeedItem,
): SubscriptionItem => {
	const { feedUrl } = feed
	const { guid, title, link, enclosure, contentSnippet, itunes } = feedItem

	const id = getFeedItemId(feedItem)
	const isoDate = getFeedItemIsoDate(feedItem)
	const durationTime = parseDurationToSeconds(itunes?.duration)

	return {
		feedUrl,
		id,
		title,
		link,
		enclosure,
		contentSnippet,
		guid,
		isoDate,
		activity: {
			durationTime,
		},
	}
}

export const transformFeedToSubscriptionItems = (
	feed: Feed,
): Indexed<SubscriptionItem> => {
	const idToItem = mapToIndexed(feed.items, i => {
		const si = transformFeedItemToSubscriptionItem(feed, i)
		return [si.id, si]
	})
	return idToItem
}

export const transformFeedToSubscription = (feed: Feed): Subscription => {
	const { feedUrl, url, link, title, description, image, pubDate } = feed

	const isoDate = parseDate(pubDate).toISO()
	const pulledIsoDate = getNow().toISO()

	return {
		feedUrl,
		url: url ?? feedUrl,
		link,
		title,
		description,
		image,
		isoDate,
		pulledIsoDate,
	}
}

export const mergeFeedIntoState = (
	draft: Draft<SubscriptionsState>,
	feed: Feed,
): void => {
	const { feedUrl } = feed
	const existing = draft.feedUrlToSubscription[feedUrl]

	if (!existing) {
		log.error('Updating feed that is not subscribed', feed.link)
		return
	}

	const subscription = transformFeedToSubscription(feed)

	// Filling in missing auth urls
	if (!existing.url) {
		existing.url = subscription.url
	}

	// Use truncated
	existing.description = subscription.description

	// Sync dates
	existing.isoDate = subscription.isoDate
	existing.pulledIsoDate = subscription.pulledIsoDate

	const existingItems = draft.feedUrlToItemIdToItem[feedUrl] ?? {}
	draft.feedUrlToItemIdToItem[feedUrl] = existingItems

	const items = transformFeedToSubscriptionItems(feed)
	entries(items).forEach(([id, item]) => {
		const existingItem = existingItems[id]
		existingItems[id] = {
			...existingItem,
			...item,
			activity: { ...item.activity, ...existingItem?.activity },
		}
	})
}

export const ExportableGuard = Guard.narrow({
	subscriptions: [
		{
			items: [
				{
					feedUrl: 'string',
				},
			],
			feedUrl: 'string',
			url: 'string',
			link: 'string',
			title: 'string',
			description: 'string',
			isoDate: 'string',
			pulledIsoDate: 'string',
		},
	],
})

export type Exportable = ReadonlyDeep<Payload<typeof ExportableGuard>>

export const getActiveDate = (s: SubscriptionItem) => {
	return (
		sorted(
			compact([
				s.activity.completedIsoDate,
				s.activity.playedIsoDate,
				s.isoDate,
			]).map(ds => fromIso(ds)),
			cmpIsoDate.desc,
		)[0] ?? getEpoch()
	)
}

export const getPubDate = (s: SubscriptionItem) => {
	return fromIso(s.isoDate)
}

/**
 * An item is active if:
 *  - It was published in the last 4 weeks
 *  - OR it has EVER been listened to (or completed)
 */
export const hasActivity = (s: SubscriptionItem): boolean => {
	const age = getNow().diff(getActiveDate(s))
	if (age.as('weeks') < 4) {
		return true
	}
	return (
		compact([s.activity.completedIsoDate, s.activity.playedIsoDate]).length > 0
	)
}
