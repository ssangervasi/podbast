import { isDev, isTest } from './utils/isDev'

if (isDev()) {
	import('preact/debug')
}

import { render } from 'preact'

import { App } from './app'

render(<App />, document.getElementById('app')!)

if (isTest()) {
	import('/src/devtools/windowDecorator').then(({ decorateWindow }) => {
		decorateWindow()
	})
}
