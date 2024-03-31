import { Feed, FeedItem } from '/src/features/rss'
import { Indexed, mapToIndexed } from '/src/utils/collections'
import { DateTime, getNow, parseDate } from '/src/utils/datetime'

export type Subscription = {
	// Unique ID
	feedUrl: string
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
	content?: string
	contentSnippet?: string
	// Pub date
	isoDate: string
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
	const { guid, title, link, enclosure, content, contentSnippet } = feedItem

	const id = getFeedItemId(feedItem)
	const isoDate = getFeedItemIsoDate(feedItem)

	return {
		feedUrl,
		id,
		title,
		link,
		enclosure,
		content,
		contentSnippet,
		guid,
		isoDate,
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
	const { feedUrl, link, title, description, image, pubDate } = feed

	const isoDate = parseDate(pubDate).toISO()
	const pulledIsoDate = getNow().toISO()

	return {
		feedUrl,
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
