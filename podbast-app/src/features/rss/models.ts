import { Guard, type Narrower, Payload, some } from 'narrow-minded'

// Should have put this in narrow-minded to begin with
const optional = <N extends Narrower>(n: N) => some('undefined', n)

export const FeedResponseGuard = Guard.narrow({
	// More: https://www.rssboard.org/rss-specification#hrelementsOfLtitemgt
	content: {
		// Required
		title: 'string',
		link: 'string',
		description: 'string',
		feedUrl: 'string',
		url: optional('string'),

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

				content: optional('string'),
				contentSnippet: optional('string'),
				isoDate: optional('string'),

				// More: https://help.apple.com/itc/podcasts_connect/#/itcb54353390
				itunes: optional({
					author: optional('string'),
					subtitle: optional('string'),
					summary: optional('string'),
					explicit: optional('string'),
					duration: optional('string'),
					episode: optional('string'),
					episodeType: optional('string'),
				}),
			},
		],

		// Optional
		image: optional({
			link: 'string',
			url: 'string',
			title: 'string',
		}),
		pubDate: optional('string'),
		language: optional('string'),

		// Detecting feed changes
		lastBuildDate: optional('string'),

		// Atom stuff?
		paginationLinks: optional({
			self: 'string',
		}),
	},
})

export type FeedResponse = Payload<typeof FeedResponseGuard>
export type Feed = FeedResponse['content']
export type FeedImage = Feed['image']
export type FeedItem = Feed['items'][number]

export const OpmlResponseGuard = Guard.narrow({
	content: {
		feeds: [{ title: 'string', url: 'string' }],
	},
})
export type OpmlResponse = Payload<typeof OpmlResponseGuard>
export type OutlineFeed = {
	title: string
	url: string
}
export type Outline = {
	feeds: OutlineFeed[]
}
