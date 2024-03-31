import { FeedResponse } from '/src/features/rss'

describe('subscriptions', () => {
	before(() => {
		cy.visit('/')

		cy.findByRole('button', { name: 'Add feed' }).click()
		cy.findByRole('textbox').type('fake-search')

		cy.intercept(
			{
				pathname: '/api/rss',
			},
			{ fixture: 'feedStubs/trashfuture.json' },
		).as('getTF')
		cy.findByRole('button', { name: 'Load' }).click()
		cy.wait('@getTF')
		cy.findByRole('button', { name: 'Subscribe' }).click()

		cy.intercept(
			{
				pathname: '/api/rss',
			},
			{ fixture: 'feedStubs/comedy_bang_bang_the_podcast.json' },
		).as('getCBB')
		cy.findByRole('button', { name: 'Load' }).click()
		cy.wait('@getCBB')
		cy.findByRole('button', { name: 'Subscribe' }).click()
		cy.findByRole('button', { name: 'Subscriptions' }).click()

		cy.appStateSnapshotSave('snappy')
	})

	beforeEach(() => {
		cy.visit('/')
		cy.appStateSnapshotLoad('snappy')
	})

	it('shows the two most recent per subscription', () => {
		cy.findAllByText(/trashfuture/i).should('exist')
	})

	// it('shows the two most recent per subscription', () => {
	// 	cy.findByText(/trashfuture/i)
	// })
})
