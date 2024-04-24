import { type Draft } from 'immer'
import { Guard, Payload } from 'narrow-minded'

import { Feed, FeedItem } from '/src/features/rss'
import { entries, log } from '/src/utils'
import { Indexed, mapToIndexed } from '/src/utils/collections'
import {
	DateTime,
	getNow,
	parseDate,
	parseDurationToSeconds,
} from '/src/utils/datetime'

export type Subscription = {
	// Unique ID
	feedUrl: string

	// URL provided by the user, which may include auth params
	url: string

	// Canonical website for the podcast
	link: string
	title: string
	description: string

	// Pub date
	isoDate: string
	// Pulled date
	pulledIsoDate: string

	image?: {
		url: string
		title: string
		link: string
	}
}

export type SubscriptionItem = {
	feedUrl: string
	// Unique ID
	id: string
	title: string
	link: string
	enclosure: {
		url: string
		length: string
		type: string
	}
	guid?: string
	contentSnippet?: string
	// Pub date
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

export const cmpDate = (a: string, b: string): number => {
	const da = DateTime.fromISO(a)
	const db = DateTime.fromISO(b)
	return da.toMillis() - db.toMillis()
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

export type Exportable = Payload<typeof ExportableGuard>
