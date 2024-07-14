import { DateTime } from 'luxon'

import { FeedResponse } from '/src/features/rss'

describe('latest episodes', () => {
	// Recency of episodes is relative to browser time.
	const NOW = DateTime.fromISO('2024-03-24T12:00:00.000Z')

	beforeEach(() => {
		cy.clock(NOW.toMillis(), ['Date'])

		cy.visit('/')

		cy.appStateLoad('subscriber')
		cy.findByRole('button', { name: 'Latest episodes' }).click()
	})

	it('shows the two most recent per subscription', () => {
		cy.findAllByLabelText('Expand text').first().click()

		cy.findAllByTestId('EpisodeRow-item-title').should('have.length', 4)
	})

	it.only('refreshes when the feed has new items', () => {
		cy.fixture('feedStubs/trashfuture.json')
			.as('feedTF')
			.produce<FeedResponse>('@feedTF', draft => {
				const prevItem = draft.content.items[0]!
				draft.content.items.unshift({
					title: 'New TF ep',
					guid: 'new-tf-ep',
					pubDate: '2024-03-24T10:00:00Z',
					link: prevItem.link,
					enclosure: prevItem.enclosure,
					contentSnippet: prevItem.contentSnippet,
					content: undefined,
					isoDate: undefined,
					itunes: undefined,
				})
			})
			.then(updatedBody => {
				cy.intercept(
					{
						pathname: '/api/rss',
						query: {
							url: /tf-url/,
						},
					},
					{
						statusCode: 200,
						body: updatedBody,
					},
				).as('getTF')
			})

		cy.intercept(
			{
				pathname: '/api/rss',
				query: {
					url: /cbb-url/,
				},
			},
			{ fixture: 'feedStubs/comedy_bang_bang_the_podcast.json' },
		)

		cy.findByText('Refresh all').click()

		cy.wait('@getTF')

		// Five second interval on checking for new pulls. Could probably implement to use changes in
		// pulled time instead.
		cy.wait(5_000)

		cy.findByText('New TF ep')
		cy.findAllByTestId('EpisodeRow-item-title').should('have.length', 4)
	})
})
