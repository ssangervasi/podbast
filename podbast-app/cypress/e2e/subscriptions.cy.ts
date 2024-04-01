import { FeedResponse } from '/src/features/rss'

describe('subscriptions', () => {
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
