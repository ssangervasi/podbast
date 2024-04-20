import { store } from '/src/store/store'
import { log } from '/src/utils'
import { isTest } from '/src/utils/isDev'

const logger = log.with({ prefix: 'testTools' })

export const decorateWindow = () => {
	if (typeof window !== 'object') {
		logger.debug('no window')
		return
	}
	if (window.TEST) {
		logger.debug('window.TEST already defined')
		return
	}

	window.TEST = {
		store,
	}

	logger.debug('defined window.TEST', window.TEST)
}

if (isTest()) {
	decorateWindow()
}
