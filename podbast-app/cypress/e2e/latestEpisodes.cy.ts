import { FeedResponse } from '/src/features/rss'

describe('latest episodes', () => {
	beforeEach(() => {
		cy.visit('/')
		cy.appStateLoad('subscriber')
		cy.findByRole('button', { name: 'Latest episodes' }).click()
	})

	it('shows the two most recent per subscription', () => {
		cy.findAllByLabelText('Expand text').first().click()

		cy.findAllByTestId('EpisodeRow-subscription-title').should('have.length', 4)
	})

	it('refreshes when the feed has new items', () => {
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

		cy.findByText('Refresh all').click()

		cy.wait('@getTF')

		// cy.appState()
		cy.findByText('Big snorbins')
		cy.findAllByTestId('EpisodeRow-subscription-title').should('have.length', 4)
	})
})
