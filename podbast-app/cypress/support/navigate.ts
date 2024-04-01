import { type RootState } from '/src/devtools/cypressImportable'

export const navigate = (to: RootState['layout']['layout']) => {
	cy.get(`button[data-nav="${to}"]`).click()
}
