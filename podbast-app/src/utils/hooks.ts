import { useEffect, useRef } from 'preact/hooks'

export * from './useChunker'

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

/**
 *
 * @param cb The callback to invoke on each interval. This argument can be changed on repeated calls
 * 	to the hook; the last function passed will be the one that runs on the next interval.
 * @param ms The delay in milliseconds passed to setInterval.
 * @param options
 */
export const useInterval = (
	cb: () => void,
	ms: number,
	options: {
		/**
		 * If true, `cb` is invoked for the first time immediately (using a setTimeout of zero). So the
		 * second time will happen after `ms` has passed.
		 */
		immediate?: boolean
	} = {},
): void => {
	const cbRef = useUpdatingRef(cb)
	const { immediate = true } = options

	useEffect(() => {
		const caller = () => {
			cbRef.current()
		}

		if (immediate) {
			setTimeout(caller, 0)
		}

		const interId = setInterval(caller, ms)

		return () => {
			clearInterval(interId)
		}
	}, [])
}
