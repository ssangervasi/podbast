import { useMemo, useReducer } from 'preact/hooks'

const INIT_START = 0
const INIT_SIZE = 10

export const useChunker = <I>({ items }: { items: I[] }) => {
	const size = INIT_SIZE

	const [state, dispatch] = useReducer(
		(prevState, _action: 'next') => {
			const start = prevState.start + size
			const chunk = items.slice(start, start + size)
			return {
				chunk,
				start,
			}
		},
		undefined,
		() => ({
			start: INIT_START,
			chunk: items.slice(INIT_START, size),
		}),
	)

	return useMemo(() => {
		const itemsAfter = Math.max(0, items.length - (state.start + size))

		return {
			...state,
			itemsAfter,
			nextChunk: () => dispatch('next'),
		}
	}, [state])
}
