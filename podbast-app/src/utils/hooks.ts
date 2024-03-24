import { useRef } from 'preact/hooks'

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
