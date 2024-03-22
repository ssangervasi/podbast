/// <reference types="cypress" />

import '@testing-library/cypress/add-commands'

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//     }
//   }
// }
import { type RootState, TEST_reset } from '/src/devtools/cypressImportable'

Cypress.Commands.add('appStateReset', appState => {
	cy.window().then(win => {
		win.TEST.store.dispatch(TEST_reset(appState))
	})
})

Cypress.Commands.add('appStateSnapshot', () => {
	cy.window().then(win => {
		const appState = win.TEST.store.getState()
		cy.log('appStateSnapshot', JSON.stringify(appState, null, 2))
	})
})

Cypress.Commands.add('aliases', function (...aliasNames) {
	const m: any = {}
	for (const an of aliasNames) {
		// Initial attempt that doesn't refresh aliases.
		m[an] = this[an]
	}
	return m
})

Cypress.Commands.add('fixtures', aliasToPath => {
	Object.entries(aliasToPath).forEach(([a, p]) => {
		cy.fixture(p).as(a)
	})
	return cy.aliases(...Object.keys(aliasToPath))
})

declare global {
	namespace Cypress {
		interface Chainable {
			appStateReset(appState: Partial<RootState>): Chainable<void>
			appStateSnapshot(): Chainable<void>

			//
			aliases<AN extends string[]>(
				...aliasNames: AN
			): Chainable<{
				[alias in AN[number]]: any
			}>
			fixtures<ATP extends Record<string, string>>(
				aliasToPath: ATP,
			): Chainable<{
				[alias in keyof ATP]: any
			}>
		}
	}
}
