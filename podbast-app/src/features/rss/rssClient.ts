import { FeedResponseGuard } from '/src/features/rss/guards'
import { log } from '/src/utils'

const LOCAL_URLS_VAR = `${import.meta.env.VITE_LOCAL_RSS_FEEDS ?? ''}`

export const LOCAL_URLS = LOCAL_URLS_VAR.split(/\s+/).filter(
	u => u.length && URL.canParse(u),
)

export const getFeed = async (url: string) => {
	const apiUrl = new URL('/api/rss', window.location.origin)
	apiUrl.searchParams.set('url', url)

	try {
		const res = await fetch(apiUrl)
		const json = await res.json()

		if (FeedResponseGuard.satisfied(json)) {
			return json.content
		}

		throw new Error('Invalid feed JSON')
	} catch (e) {
		log.info('Feed error', e)
		throw e
	}
}
