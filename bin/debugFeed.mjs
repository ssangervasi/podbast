#!/usr/bin/env node
import { narrow } from 'narrow-minded'

const main = async () => {
	const { feedUrl } = process.argv.reduce(
		(v, a, i) => {
			if (v.scriptIdx === -1) {
				if (a.includes('debugFeed')) {
					v.scriptIdx = i
				}
			} else if (!v.feedUrl) {
				if (URL.canParse(a)) {
					v.feedUrl = a
				}
			}

			return v
		},
		{ scriptIdx: -1, feedUrl: undefined },
	)
	if (!feedUrl) {
		throw new Error('No URL')
	}

	console.log('Fetching:', feedUrl)
	const json = await fetchFeedThroughServer(feedUrl)

	if (
		!narrow(
			{
				content: {
					feedUrl: 'string',
					items: [],
				},
			},
			json,
		)
	) {
		throw new Error('Content invalid')
	}

	json.content.items.forEach(item => {
		if (
			!narrow(
				{
					title: 'string',
					guid: 'string',
					enclosure: {
						url: 'string',
						length: 'string',
						type: 'string',
					},
					pubDate: 'string',
				},
				item,
			)
		) {
			console.error(JSON.stringify(item, null, 2))
			throw new Error('Invalid item')
		}
	})

	console.log('Seems fine')
}

const fetchFeedThroughServer = async feedUrl => {
	const apiUrl = new URL('/api/rss', 'http://localhost:42993')
	apiUrl.searchParams.set('url', feedUrl)
	console.log(apiUrl)

	try {
		const res = await fetch(apiUrl)
		if (res.status >= 300) {
			throw new Error(`Request failed with status ${res.status}`)
		}

		const json = await res.json()

		return json
	} catch (e) {
		console.error('Feed error', e)
		throw e
	}
}

main()
