describe('find feed', () => {
	it('passes', () => {
		cy.visit('/')

		cy.findByRole('button', { name: 'Find feed' }).click()
		cy.findByRole('textbox').type('fake-search')

		cy.intercept(
			{ pathname: 'rss' },
			{ fixture: 'feedStubs/trashfuture.json' },
		).as('getRss')
		cy.findByRole('button', { name: 'Request' }).click()
		cy.wait('@getRss')

		// cy.contains('Find feed').click()

		cy.findByRole('button', { name: 'Subscribe' }).click()

		cy.findByRole('button', { name: 'Subscriptions' }).click()

		// cy.appStateSnapshot()
		// cy.pause()
	})
})

describe('layout', () => {
	it('can populate store', () => {
		cy.visit('/')
		// cy.findByRole('button', { name: 'Find feed' }).click()

		cy.fixture('feedStubs/comedy_bang_bang_the_podcast.json').as('feedCBB')
		cy.fixture('feedStubs/trashfuture.json').as('feedTF')
		cy.then(function () {
			cy.appStateReset({
				layout: {
					layout: 'subscriptions',
				},
				subscriptions: [
					{
						link: 'example.sangervasi.net/pod/1',
						title: 'Pod 1',
						feed: {
							items: [],
							feedUrl: '',
							image: {
								link: '',
								url: '',
								title: '',
							},
							paginationLinks: undefined,
							title: 'Pod 1',
							description: 'This is Pod 1',
							pubDate: '',
							link: '',
							language: '',
							lastBuildDate: '',
						},
					},
					{
						link: this.feedTF.content.link,
						title: this.feedTF.content.title,
						feed: {
							items: [],
							feedUrl: '',
							image: {
								link: '',
								url: '',
								title: '',
							},
							paginationLinks: undefined,
							title: 'Pod 1',
							description: 'This is Pod 1',
							pubDate: '',
							link: '',
							language: '',
							lastBuildDate: '',
						},
					},
				],
			})
		})
		// cy.pause()
	})
})
