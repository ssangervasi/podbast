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

Cypress.Commands.add('appStateSet', appState => {
	cy.window().then(win => {
		win.TEST.store.dispatch(TEST_reset(appState))
		return win.TEST.store.getState()
	})
})

Cypress.Commands.add('appStateGet', () =>
	cy.window().then(win => win.TEST.store.getState()),
)

Cypress.Commands.add('appStatePath', name => {
	return cy.wrap(`cypress/fixtures/appStates/${name}.json`)
})

type AppStateBody = {
	description: string
	generatedBy: string
	appState: RootState
}

Cypress.Commands.add('appStateSave', (name, description = undefined) => {
	// const specDir = Cypress.spec.fileName
	// if (!specDir) {
	// 	throw 'WTF no spec spec fileName!'
	// }

	return cy.appStateGet().then(appState => {
		const specFileName = Cypress.spec.fileName ?? ''
		cy.log(`Saving appState "${name}" from "${specFileName}"`)

		cy.appStatePath(name).then(path => {
			const appStateBody: AppStateBody = {
				description: description ?? name,
				generatedBy: specFileName,
				appState,
			}
			cy.writeFile(path, JSON.stringify(appStateBody, null, 2))
		})
		return cy.wrap(appState)
	})
})

Cypress.Commands.add('appStateLoad', name => {
	return cy.appStatePath(name).then(path => {
		cy.log(`Loading appState ${name}`)

		return cy.readFile(path).then((appStateBody: AppStateBody) => {
			const { appState } = appStateBody
			return cy.appStateSet(appState)
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
			appStateSet(appState: Partial<RootState>): Chainable<RootState>
			appStateGet(): Chainable<RootState>
			appStatePath(name: string): Chainable<string>
			appStateSave(name: string, description?: string): Chainable<RootState>
			appStateLoad(name: string): Chainable<RootState>

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
