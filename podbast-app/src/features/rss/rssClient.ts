import { diffNarrow } from 'narrow-minded'

import { apiFetch } from '/src/features/rss/apiClient'
import { buildUrl, isDev, log, stall, UrlIsh } from '/src/utils'

import { Feed, FeedResponseGuard, FeedResponseNarrower } from './models'

// Yay single thread, can just do this.
const counters = {
	fetching: 0,
	waiting: 0,
}

const logger = log.with({ prefix: 'rssClient' })

export const getFeed = async (urlish: UrlIsh): Promise<Feed> => {
	const url = buildUrl(urlish).toString()
	if (!url) {
		throw new Error('getFeed: Invalid feed url')
	}

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
		let modelDiff
		if (isDev()) {
			modelDiff = diffNarrow(FeedResponseNarrower, json)
			logger.debug('getFeed: model diff', { modelDiff, json })
		}
		throw new Error('getFeed: Invalid feed JSON', { cause: { modelDiff } })
	}

	// Inject URL used for actual request
	const feed = json.content
	if (!feed.url) {
		feed.url = url
	}
	return feed
}
