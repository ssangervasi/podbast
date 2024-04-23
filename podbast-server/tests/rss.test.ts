import { strict as assert } from 'node:assert'
import { beforeEach, describe, it } from 'node:test'

import { cleanRss } from '/src/rss.js'
import Parser from 'rss-parser'

const makeLong = (n: number) =>
	`Haha ` +
	Array(n / 2)
		.fill('ha')
		.join('') +
	' hee!'

describe('cleanRss', () => {
	it('truncates the contentSnippet', async () => {
		const makeParsed = () =>
			({
				description: makeLong(1_010),
				items: [
					{
						contentSnippet: makeLong(1_010),
					},
				],
			} as Parser.Output<{}>)
		const parsed = makeParsed()
		cleanRss(parsed)
		assert.equal(parsed.description?.length, 1_000)
		assert.equal(parsed.items?.[0]?.contentSnippet?.length, 1_000)
	})
})
