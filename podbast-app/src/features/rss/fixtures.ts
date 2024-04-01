import { Feed, FeedResponse } from './models'

export const FEED: Feed = {
	items: [
		{
			title: 'How to snorp a dorp',
			link: 'https://www.patreon.com/posts/equitable-lagoon-83745026',
			pubDate: 'pubDate',
			enclosure: {
				url: 'https://example.sangervasi.net/pod/83745026/e5500b7b10ca4aa0b9c3209e95f5baf4/eyJhIjoxLCJpc19hdWRpbyI6MSwicCI6MX0%3D/1.wav?token-time=1704758400&token-hash=SfkNmSkJENyVwgrIJFigeFfuOb1uf-xp5npPM--IvuM%3D',
				length: '123456',
				type: 'audio/x-wav',
			},
			content: 'Content with <strong>stuff</strong>',
			contentSnippet: 'Snip snip',
			guid: '8675309',
			isoDate: 'isoDate',
		},
	],
	feedUrl: 'https://www.patreon.com/posts',
	image: {} as any,
	paginationLinks: {} as any,
	title: 'The dorp snorp fake feed',
	description: 'string',
	pubDate: 'string',
	link: 'string',
	language: 'string',
	lastBuildDate: 'string',
}

export const FEED_RESPONSE: FeedResponse = {
	content: FEED,
}
