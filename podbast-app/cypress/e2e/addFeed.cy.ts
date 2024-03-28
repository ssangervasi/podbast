describe('add feed', () => {
	beforeEach(() => {
		cy.visit('/')
		cy.findByRole('button', { name: 'Add feed' }).click()
	})

	it('can load a feed and subscribe', () => {
		cy.findByRole('textbox').type('fake-search')

		cy.intercept(
			{ pathname: '/api/rss' },
			{ fixture: 'feedStubs/trashfuture.json' },
		).as('getTF')
		cy.findByRole('button', { name: 'Load' }).click()
		cy.wait('@getTF')

		cy.findByRole('button', { name: 'Subscribe' }).click()

		cy.findByRole('button', { name: 'Subscriptions' }).click()
	})

	it('can import an opml file', () => {
		cy.findByRole('button', { name: 'Import' }).click()

		
	})
})
