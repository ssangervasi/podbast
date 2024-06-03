describe('add feed', () => {
	beforeEach(() => {
		cy.visit('/')
		cy.findByRole('button', { name: 'Add feed' }).click()
	})

	it('can load a feed and subscribe', () => {
		cy.findByRole('textbox').type('https://fake-search.sangervasi.net/rss.xml')

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
		cy.fixture('feedImportable/feeds.opml').as('feedsOpml')
		cy.get('input[type=file]').selectFile('@feedsOpml')
		cy.intercept(
			{ pathname: '/api/opml', method: 'post' },
			{ fixture: 'feedImportable/feeds.json' },
		)
		cy.findByRole('button', { name: 'Upload' }).click()

		cy.findAllByTestId(/UploadForm-row/).should('have.length', 3)

		cy.intercept(
			{ pathname: '/api/rss' },
			{ fixture: 'feedStubs/trashfuture.json' },
		).as('getA')

		cy.findByTestId('UploadForm-row:a')
			.findByRole('button', { name: 'Load' })
			.click()

		cy.wait('@getA')
			.its('request.query.url')
			.should('eq', 'https://a.sangervasi.net/podcast.rss')
	})
})
