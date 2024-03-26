import { FeedResponse } from '/src/features/rss'

describe('latest episodes', () => {
	const preloadState = () => {
		cy.visit('/')

		cy.findByRole('button', { name: 'Add feed' }).click()
		cy.findByRole('textbox').type('fake-search')

		cy.intercept(
			{
				pathname: '/api/rss',
			},
			{ fixture: 'feedStubs/trashfuture.json' },
		).as('getTF')
		cy.findByRole('button', { name: 'Request' }).click()
		cy.wait('@getTF')
		cy.findByRole('button', { name: 'Subscribe' }).click()

		cy.intercept(
			{
				pathname: '/api/rss',
			},
			{ fixture: 'feedStubs/comedy_bang_bang_the_podcast.json' },
		).as('getCBB')
		cy.findByRole('button', { name: 'Request' }).click()
		cy.wait('@getCBB')
		cy.findByRole('button', { name: 'Subscribe' }).click()

		// cy.appStateSnapshot()
		cy.findByRole('button', { name: 'Latest episodes' }).click()
	}

	it('shows the two most recent per subscription', () => {
		preloadState()
		cy.findAllByLabelText('Expand text').first().click()

		cy.findAllByTestId('EpisodeRow-subscription-title').should('have.length', 4)
	})

	it('refreshes when the feed has new items', () => {
		preloadState()

		cy.fixture('feedStubs/trashfuture.json')
			.as('feedTF')
			.produce<FeedResponse>('@feedTF', draft => {
				draft.content.items.unshift({
					...draft.content.items[0]!,
					title: 'Big snorbins',
					guid: 'big-snorbins',
				})
			})
			.then(updatedBody => {
				cy.intercept(
					{
						pathname: '/api/rss',
						query: {
							url: /trashfuture/,
						},
					},
					{
						statusCode: 200,
						body: updatedBody,
					},
				).as('getTF')
			})

		cy.findByText('Refresh').click()

		cy.wait('@getTF')

		// cy.appStateSnapshot()
		cy.findByText('Big snorbins')
		cy.findAllByTestId('EpisodeRow-subscription-title').should('have.length', 4)
	})
})
