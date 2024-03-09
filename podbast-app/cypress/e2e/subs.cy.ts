describe('find feed', () => {
	it('passes', () => {
		cy.visit('/')

		cy.findByRole('button', { name: 'Find feed' }).click()
		cy.findByRole('textbox').type('fake-search')

		cy.intercept({ pathname: 'rss' }, { fixture: 'guru-stub.json' }).as(
			'getRss',
		)
		cy.findByRole('button', { name: 'Request' }).click()
		cy.wait('@getRss')

		cy.contains('Find feed').click()

		cy.findByRole('button', { name: 'Subscribe' }).click()

		cy.findByRole('button', { name: 'Subscriptions' }).click()

		cy.appStateSnapshot()
		cy.pause()
	})
})

describe('layout', () => {
	it('can populate store', () => {
		cy.visit('/')
		cy.findByRole('button', { name: 'Find feed' }).click()

		cy.appStateReset({
			common: undefined,
			layout: undefined,
			player: undefined,
			rss: undefined,
			subscriptions: undefined,
			_persist: undefined,
		} as any)

		cy.pause()
	})
})
