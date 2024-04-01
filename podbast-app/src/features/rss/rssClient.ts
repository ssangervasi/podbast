import { FeedResponseGuard } from './models'
import { log } from '/src/utils'

export const getFeed = async (url: string) => {
	try {
		if (!url) {
			throw new Error('getFeed: Invalid feed url')
		}

		const apiUrl = new URL('/api/rss', window.location.origin)
		apiUrl.searchParams.set('url', url)

		const res = await fetch(apiUrl)
		if (400 <= res.status) {
			throw new Error(`getFeed: Request failed. Status: ${res.status}`)
		}

		const json = await res.json()

		if (FeedResponseGuard.satisfied(json)) {
			return json.content
		}

		throw new Error('getFeed: Invalid feed JSON')
	} catch (e) {
		log.error('Feed error', JSON.stringify(url), e)
		throw e
	}
}
