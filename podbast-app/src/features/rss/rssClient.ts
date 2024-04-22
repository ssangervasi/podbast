import { apiFetch } from '/src/features/rss/apiClient'
import { buildUrl, UrlIsh } from '/src/utils'

import { FeedResponseGuard } from './models'

export const getFeed = async (urlish: UrlIsh) => {
	const url = buildUrl(urlish).toString()
	if (!url) {
		throw new Error('getFeed: Invalid feed url')
	}

	const { json } = await apiFetch({
		route: 'rss',
		params: {
			url: url,
		},
	})

	if (!FeedResponseGuard.satisfied(json)) {
		throw new Error('getFeed: Invalid feed JSON')
	}

	// Inject URL used for actual request
	const feed = json.content
	if (!feed.url) {
		feed.url = url
	}
	return feed
}
