describe('generate states', () => {
	it('generates subscriber', () => {
		cy.visit('/')

		cy.findByRole('button', { name: 'Add feed' }).click()
		cy.findByRole('textbox').type('https://fake-search.sangervasi.net/rss.xml')

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

		cy.appStateSave('subscriber', 'two subscribed podcsts')
	})
})
