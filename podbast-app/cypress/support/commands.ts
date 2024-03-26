/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands'

import { Draft, produce } from 'immer'

import { type RootState, TEST_reset } from '/src/devtools/cypressImportable'

Cypress.Commands.add('appStateReset', appState => {
	cy.window().then(win => {
		win.TEST.store.dispatch(TEST_reset(appState))
		return win.TEST.store.getState()
	})
})

Cypress.Commands.add('appStateGet', () =>
	cy.window().then(win => win.TEST.store.getState()),
)

Cypress.Commands.add('appStateSnapshotPath', name => {
	const specDir = Cypress.spec.fileName
	if (!specDir) {
		throw 'WTF no spec spec fileName!'
	}

	return cy.wrap(`cypress/fixtures/appStates/${specDir}/${name}.json`)
})

Cypress.Commands.add('appStateSnapshotSave', name => {
	return cy.appStateGet().then(appState => {
		cy.log(`Saving appState ${name}`)

		cy.appStateSnapshotPath(name).then(snapshotPath => {
			cy.writeFile(snapshotPath, JSON.stringify(appState, null, 2))
		})
		return cy.wrap(appState)
	})
})

Cypress.Commands.add('appStateSnapshotLoad', name => {
	return cy.appStateSnapshotPath(name).then(snapshotPath => {
		return cy.readFile(snapshotPath).then(appState => {
			cy.log(`Loading appState ${name}`)
			return cy.appStateReset(appState)
		})
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

Cypress.Commands.add(
	'produce',
	<R>(
		selector: string,
		producer: (draft: Draft<R>) => Draft<R> | void,
	): Cypress.Chainable<R> => {
		return cy.get<R>(selector).then(content => {
			return produce(content, producer)
		})
	},
)

declare global {
	namespace Cypress {
		interface Chainable {
			appStateReset(appState: Partial<RootState>): Chainable<RootState>
			appStateGet(): Chainable<RootState>

			appStateSnapshotPath(name: string): Chainable<string>
			appStateSnapshotSave(name: string): Chainable<RootState>
			appStateSnapshotLoad(name: string): Chainable<RootState>

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

			produce<R>(
				selector: string,
				producer: (draft: Draft<R>) => Draft<R> | void,
			): Chainable<R>
		}
	}
}
