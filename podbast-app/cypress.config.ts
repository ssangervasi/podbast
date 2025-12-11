import { defineConfig } from 'cypress'

import viteConfig from './vite.config'

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:42994',
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},

	component: {
		devServer: {
			framework: 'react',
			bundler: 'vite',
			viteConfig,
		},
	},
})
