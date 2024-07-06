import { useMemo, useReducer } from 'preact/hooks'

const INIT_START = 0
const INIT_SIZE = 10

export const useChunker = <I>({ items }: { items: readonly I[] }) => {
	const size = INIT_SIZE

	const [state, dispatch] = useReducer(
		(prevState, _action: 'next') => {
			const start = prevState.start + size
			return {
				start,
			}
		},
		undefined,
		() => ({
			start: INIT_START,
		}),
	)

	return useMemo(() => {
		const { start } = state
		// Exclusive index
		const end = start + size
		const chunk = items.slice(start, end)
		const itemsAfter = Math.max(0, items.length - (state.start + size))

		console.debug(
			'DEBUG(ssangervasi)',
			'Chunk changed',
			chunk.length,
			itemsAfter,
		)

		return {
			chunk,
			start,
			end,
			itemsAfter,
			nextChunk: () => dispatch('next'),
		}
	}, [state, items])
}
