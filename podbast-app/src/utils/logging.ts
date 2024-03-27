import { isDev } from './isDev'

const logState = {
	lastMs: 0,
}

const nextDelta = () => {
	const prev = logState.lastMs
	const now = Date.now()
	logState.lastMs = now

	if (prev === 0) {
		return 0
	}

	return now - prev
}

const _log = (
	level: 'error' | 'info' | 'debug' = 'info',
	prefix = '',
	...args: unknown[]
) => {
	if (!isDev()) {
		return
	}
	const preArr = prefix ? `[${prefix}]` : []
	console[level](...preArr, ...args)
}

export const log = Object.assign(_log, {
	info: (...args: unknown[]) => {
		_log('info', '', ...args)
	},
	error: (...args: unknown[]) => {
		_log('error', '', ...args)
	},
	delta: (...args: unknown[]) => {
		_log('info', `${nextDelta()}ms`, ...args)
	},
})
