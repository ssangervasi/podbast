import { useRef } from 'preact/hooks'

/**
 * Slightly naughty ref. Immediately updates the ref's `current` with the latest argument passed to
 * it. Useful for hacking a callback where really do want the latest value passed through, but we
 * don't care about going through a render cycle.
 */
export const useUpdatingRef = <V>(updatedValue: V) => {
	const ref = useRef(updatedValue)
	ref.current = updatedValue
	return ref
}

export const mapValues = <
	InObj extends object,
	OutV,
	K extends keyof InObj,
	V extends InObj[K],
	OutObj extends { [k in K]: OutV },
>(
	inObj: InObj,
	mapFn: (v: V, k: K) => OutV,
): OutObj =>
	Object.fromEntries(
		Object.entries(inObj).map(([k, v]) => [k, mapFn(v, k as K)]),
	) as OutObj

/**
 * Logging
 */

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
	if (!import.meta.env.DEV) {
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
