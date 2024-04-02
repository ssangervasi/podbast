import { isDev } from './utils/isDev'

if (isDev()) {
	import('preact/debug')
}

import { render } from 'preact'

import { App } from './app'

render(<App />, document.getElementById('app')!)

import('/src/devtools/windowDecorator')
