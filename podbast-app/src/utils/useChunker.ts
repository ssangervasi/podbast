import { useMemo, useReducer } from 'preact/hooks'

export const useChunker = <I>({ items }: { items: I[] }) => {
	const initStart = 0
	const initSize = 10

	const [state, dispatch] = useReducer(
		(prevState, action: 'next') => {
			const start = prevState.start + initSize
			const chunk = items.slice(start, start + initSize)
			return {
				chunk,
				start,
			}
		},
		undefined,
		() => ({
			start: initStart,
			chunk: items.slice(initStart, initSize),
		}),
	)

	return useMemo(() => {
		return {
			...state,
			nextChunk: () => dispatch('next'),
		}
	}, [state])
}
