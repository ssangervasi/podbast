import { produce } from 'immer'
import { useEffect, useMemo, useReducer } from 'preact/hooks'

const INIT_START = 0
const INIT_SIZE = 10

type ChunkerState = {
	start: number
}

export const useChunker = <I>({
	items,
	size: sizeOption,
}: {
	items: readonly I[]

	size?: number
}) => {
	const size = useMemo(() => sizeOption ?? INIT_SIZE, [sizeOption])

	const [state, dispatch] = useReducer(
		(prevState: ChunkerState, action: 'next' | 'prev' | 'first') => {
			return produce(prevState, draft => {
				if (action === 'next') {
					// Scope question
					draft.start = Math.min(prevState.start + size, items.length)
				}
				if (action === 'prev') {
					draft.start = Math.max(0, prevState.start - size)
				}
				if (action === 'first') {
					draft.start = 0
				}
			})
		},
		undefined,
		() =>
			({
				start: INIT_START,
			}) satisfies ChunkerState,
	)

	useEffect(() => {
		dispatch('first')
	}, [items])

	return useMemo(() => {
		const { start } = state
		// Exclusive index
		const end = start + size
		const chunk = items.slice(start, end)
		const itemsAfter = Math.max(0, items.length - (state.start + size))

		/**
		 * One-indexed, human-readable info.
		 */
		const chunkInfo = {
			first: start + 1,
			last: start + chunk.length,
			total: items.length,
		}

		return {
			chunk,
			end,
			itemsAfter,
			size,
			start,
			chunkInfo,
			prevChunk: () => dispatch('prev'),
			nextChunk: () => dispatch('next'),
		}
	}, [state, items])
}
