import { App } from '@tinyhttp/app'
import { narrow } from 'narrow-minded'
import Parser from 'rss-parser'

//
export const app = new App()

const truncate = (s?: string, maxLen = 1_000) => {
	if (!s) {
		return s
	}
	if (s.length <= maxLen) {
		return s
	}

	return s.slice(0, maxLen - 3) + '...'
}

export const cleanRss = (parsed: Parser.Output<{}>): void => {
	parsed.description = truncate(parsed.description)
	parsed.items.forEach(item => {
		item.content = undefined
		item.contentSnippet = truncate(item.contentSnippet)
	})
}

const parseRss = async ({ url }: { url: string }) => {
	const parser = new Parser()
	const parsed = await parser.parseURL(url)
	return parsed
}

app.get('/rss', async (req, res) => {
	if (!narrow({ url: 'string' }, req.query)) {
		console.log('/rss invalid query ')

		return res.sendStatus(400)
	}

	const parsed = await parseRss(req.query)
	cleanRss(parsed)

	res.json({
		content: parsed,
	})
})
