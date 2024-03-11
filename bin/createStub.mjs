#!/usr/bin/env node
import path from 'node:path'
import fs from 'node:fs'

const STUB_URLS = [
	'https://feed.podbean.com/trashfuturepodcast/feed.xml',
	'https://feeds.simplecast.com/byb4nhvN',
]

const fetchFeedThroughServer = async feedUrl => {
	const apiUrl = new URL('/rss', 'http://localhost:42993')
	apiUrl.searchParams.set('url', feedUrl)

	try {
		const res = await fetch(apiUrl)
		const json = await res.json()

		return json
	} catch (e) {
		console.error('Feed error', e)
		throw e
	}
}

/**
 * @param {string} title
 */
const titleToFilename = title => {
	if (!title) {
		throw new Error(`Invalid title: ${title}`)
	}
	const cleaned = title.toLowerCase().replace(/\s+/g, '_').replace(/\W/g, '')
	if (cleaned.length == 0) {
		throw new Error(`Invalid title: ${title}`)
	}
	return `${cleaned}.json`
}

const writeStub = async json => {
	const { STUBS_DIR } = loadEnv()
	const feedPath = path.join(STUBS_DIR, titleToFilename(json.content.title))
	await fs.promises.writeFile(feedPath, JSON.stringify(json, null, 2))
}

const normalize = json => {
	const {
		content: { items, ...content },
	} = json
	const truncatedItems = items.slice(0, 10)
	// console.log(content)
	return {
		content: {
			...content,
			items: truncatedItems,
		},
	}
}

const createStub = async feedUrl => {
	const json = await fetchFeedThroughServer(feedUrl)
	const normalized = normalize(json)
	// console.log('>>>', normalized)
	await writeStub(normalized)
}

const loadEnv = () => {
	const { PB_ROOT } = process.env
	if (!PB_ROOT) {
		throw new Error('No PB env')
	}
	const STUBS_DIR = path.join(PB_ROOT, 'podbast-app/cypress/fixtures/feedStubs')
	if (!fs.statSync(STUBS_DIR).isDirectory()) {
		throw new Error('No stubs dir')
	}

	return { PB_ROOT, STUBS_DIR }
}

const main = async () => {
	loadEnv()
	await Promise.all(STUB_URLS.map(u => createStub(u)))
}

main()
