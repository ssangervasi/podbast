import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

import { parseOpmlOutline } from '/src/opmls.js'

describe('opml', () => {
	it('works', async () => {
		const parsed = await parseOpmlOutline(`
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<opml version="1.0">
  <head>
    <title>Google Podcasts Feeds</title>
  </head>
  <body>
    <outline text="feeds">
      <outline
        xmlUrl="https://a.sangervasi.net/podcast.rss"
        type="rss" text="a" />
      <outline
        xmlUrl="https://b.sangervasi.net/podcast.rss"
        type="rss" text="b" />
      <outline
        xmlUrl="https://c.sangervasi.net/podcast.rss"
        type="rss" text="c" />
    </outline>
  </body>
</opml>		
`)
		assert.equal(parsed, {
			feeds: [
				{
					title: 'a',
					url: 'https://a.sangervasi.net/podcast.rss',
				},
				{
					title: 'b',
					url: 'https://b.sangervasi.net/podcast.rss',
				},
				{
					title: 'c',
					url: 'https://c.sangervasi.net/podcast.rss',
				},
			],
		})
	})
})
