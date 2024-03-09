import { store } from '/src/store/store'
import { log } from '/src/utils'

export const decorateWindow = () => {
	if (typeof window !== 'object') {
		log('debug', 'testTools', 'no window')
		return
	}
	if (window.TEST) {
		log('debug', 'testTools', 'window.TEST already defined')
		return
	}

	window.TEST = {
		store,
	}

	log('debug', 'testTools', 'defined window.TEST', window.TEST)
}

if (import.meta.env.DEV) {
	decorateWindow()
}
