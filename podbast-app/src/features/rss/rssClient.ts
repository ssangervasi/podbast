import { apiFetch } from '/src/features/rss/apiClient'
import { log } from '/src/utils'

import { FeedResponseGuard } from './models'

export type FeedUrlParts = {
	feedUrl: string | URL
	params: URLSearchParams | Record<string, string>
}

export const formatFeedUrl = (feedUrlParts: FeedUrlParts): string => {}

export const getFeed = async (feedUrlParts: FeedUrlParts) => {
	const feedUrl = formatFeedUrl(feedUrlParts)
	if (!feedUrl) {
		throw new Error('getFeed: Invalid feed url')
	}

	const { json } = await apiFetch({
		route: 'rss',
		params: {
			url: feedUrl,
		},
	})

	if (FeedResponseGuard.satisfied(json)) {
		return json.content
	}

	throw new Error('getFeed: Invalid feed JSON')
}
