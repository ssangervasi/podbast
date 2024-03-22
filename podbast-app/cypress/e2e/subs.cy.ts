describe('find feed', () => {
	it('passes', () => {
		cy.visit('/')

		cy.findByRole('button', { name: 'Add feed' }).click()
		cy.findByRole('textbox').type('fake-search')

		cy.intercept(
			{ pathname: '/api/rss' },
			{ fixture: 'feedStubs/trashfuture.json' },
		).as('getTF')
		cy.findByRole('button', { name: 'Request' }).click()
		cy.wait('@getTF')

		cy.findByRole('button', { name: 'Subscribe' }).click()

		cy.findByRole('button', { name: 'Subscriptions' }).click()
	})
})

describe('latest episodes', () => {
	it('loads from existing store', () => {
		cy.visit('/')

		cy.fixtures({
			feedCBB: 'feedStubs/comedy_bang_bang_the_podcast.json',
			feedTF: 'feedStubs/trashfuture.json',
		}).then(({ feedCBB, feedTF }) => {
			cy.appStateReset({
				layout: {
					layout: 'latest',
				},
				subscriptions: [
					{
						link: feedCBB.content.link,
						title: feedCBB.content.title,
						feed: feedCBB.content,
					},
					{
						link: feedTF.content.link,
						title: feedTF.content.title,
						feed: feedTF.content,
					},
				],
			})
		})
		cy.findAllByLabelText('Expand text').first().click()
	})

	it.only('refreshes when the feed has new items', () => {
		cy.visit('/')

		cy.fixtures({
			feedCBB: 'feedStubs/comedy_bang_bang_the_podcast.json',
			feedTF: 'feedStubs/trashfuture.json',
		}).then(({ feedCBB, feedTF }) => {
			cy.appStateReset({
				layout: {
					layout: 'latest',
				},
				subscriptions: [
					{
						link: feedCBB.content.link,
						title: feedCBB.content.title,
						feed: feedCBB.content,
					},
					{
						link: feedTF.content.link,
						title: feedTF.content.title,
						feed: feedTF.content,
					},
				],
			})
		})

		cy.intercept(
			{
				pathname: '/api/rss',
				query: {
					url: /trashfuture/,
				},
			},
			{ fixture: 'feedStubs/trashfuture.json' },
		).as('getTF')

		cy.findByText('Refresh').click()

		cy.wait('@getTF')
	})
})
