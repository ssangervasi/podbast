import { apiFetch } from '/src/features/rss/apiClient'
import { buildUrl, stall, UrlIsh } from '/src/utils'

import { FeedResponseGuard } from './models'

// Yay single thread, can just do this.
const counters = {
	fetching: 0,
	waiting: 0,
}

export const getFeed = async (urlish: UrlIsh) => {
	const url = buildUrl(urlish).toString()
	if (!url) {
		throw new Error('getFeed: Invalid feed url')
	}
	console.log(counters)

	if (counters.fetching > 0) {
		counters.waiting += 1
		await stall(50 * counters.fetching)
		counters.waiting -= 1
	}

	counters.fetching += 1
	const { json } = await apiFetch({
		route: 'rss',
		params: {
			url: url,
		},
	})
	counters.fetching -= 1

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
