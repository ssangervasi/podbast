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
