import { Guard, Payload } from 'narrow-minded'

export const FeedResponseGuard = Guard.narrow({
	content: {
		items: [
			{
				title: 'string',
				link: 'string',
				pubDate: 'string',
				enclosure: {
					url: 'string',
					length: 'string',
					type: 'string',
				},
				content: 'string',
				contentSnippet: 'string',
				guid: 'string',
				isoDate: 'string',
			},
		],
		feedUrl: 'string',
		image: {
			link: 'string',
			url: 'string',
			title: 'string',
		},
		paginationLinks: {
			self: 'string',
		},
		title: 'string',
		description: 'string',
		pubDate: 'string',
		link: 'string',
		language: 'string',
		lastBuildDate: 'string',
	},
})

export type FeedResponse = Payload<typeof FeedResponseGuard>
export type Feed = FeedResponse['content']
export type FeedImage = Feed['image']
export type FeedItem = Feed['items'][number]
