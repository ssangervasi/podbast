import { Guard, Payload, some } from 'narrow-minded'

export const FeedResponseGuard = Guard.narrow({
	content: {
		// Required
		title: 'string',
		link: 'string',
		description: 'string',
		feedUrl: 'string',

		items: [
			{
				// Required
				title: 'string',
				link: 'string',
				guid: 'string',
				enclosure: {
					url: 'string',
					length: 'string',
					type: 'string',
				},
				pubDate: 'string',
				content: some('undefined', 'string'),
				contentSnippet: some('undefined', 'string'),
				isoDate: some('undefined', 'string'),
			},
		],

		// Optional
		image: some('undefined', {
			link: 'string',
			url: 'string',
			title: 'string',
		}),
		pubDate: some('undefined', 'string'),
		language: some('undefined', 'string'),

		// Detecting feed changes
		lastBuildDate: some('undefined', 'string'),

		// Atom stuff?
		paginationLinks: some('undefined', {
			self: 'string',
		}),
	},
})

export type FeedResponse = Payload<typeof FeedResponseGuard>
export type Feed = FeedResponse['content']
export type FeedImage = Feed['image']
export type FeedItem = Feed['items'][number]
