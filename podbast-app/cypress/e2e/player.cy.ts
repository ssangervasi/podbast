import { navigate } from '../support/navigate'

describe('player', () => {
	it('shows the two most recent per subscription', () => {
		cy.visit('/')
		cy.appStateSnapshotLoad('snappy')
		navigate('latest')

		cy.findAllByLabelText('Play episode').first().click()

		cy.get('.vds-play-button').click()
		cy.get('.vds-mute-button').click()
		cy.wait(2_000)

		cy.get('.vds-play-button').click()

		// cy.get('.vds-play-button').click()
		cy.pause()

		// cy.
	})
})
