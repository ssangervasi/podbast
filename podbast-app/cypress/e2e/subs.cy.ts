describe('find feed', () => {
	it('passes', () => {
		cy.visit('/')

		cy.findByRole('button', { name: 'Find feed' }).click()
		cy.findByRole('textbox').type('fake-search')

		cy.intercept(
			{ pathname: '/api/rss' },
			{ fixture: 'feedStubs/trashfuture.json' },
		).as('getRss')
		cy.findByRole('button', { name: 'Request' }).click()
		cy.wait('@getRss')
		// cy.pause()

		// cy.contains('Find feed').click()

		cy.findByRole('button', { name: 'Subscribe' }).click()

		cy.findByRole('button', { name: 'Subscriptions' }).click()

		// cy.appStateSnapshot()
		// cy.pause()
	})
})

describe('layout', () => {
	it.only('can populate store', () => {
		cy.visit('/')
		// Extract loading and then-ing to
		cy.fixture('feedStubs/comedy_bang_bang_the_podcast.json').as('feedCBB')
		cy.fixture('feedStubs/trashfuture.json').as('feedTF')
		cy.then(function () {
			cy.appStateReset({
				layout: {
					layout: 'subscriptions',
				},
				subscriptions: [
					{
						link: this.feedCBB.content.link,
						title: this.feedCBB.content.title,
						feed: this.feedCBB.content,
					},
					{
						link: this.feedTF.content.link,
						title: this.feedTF.content.title,
						feed: this.feedTF.content,
					},
				],
			})
		})
		// cy.pause()
	})
})
