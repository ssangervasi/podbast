describe('subscriptions', () => {
	beforeEach(() => {
		cy.visit('/')
		cy.appStateLoad('subscriber')
	})

	it('shows the two most recent per subscription', () => {
		cy.findAllByText(/trashfuture/i).should('exist')
	})

	// it('shows the two most recent per subscription', () => {
	// 	cy.findByText(/trashfuture/i)
	// })
})
