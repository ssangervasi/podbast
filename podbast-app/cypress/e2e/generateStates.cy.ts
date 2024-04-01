describe('generate states', () => {
	it('generates snappy', () => {
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
})
