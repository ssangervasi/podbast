import { produce } from 'immer'
import { useMemo, useReducer } from 'preact/hooks'

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
		(prevState: ChunkerState, action: 'next' | 'prev') => {
			return produce(prevState, draft => {
				if (action === 'next') {
					draft.start = Math.min(prevState.start + size, items.length)
				}
				if (action === 'prev') {
					draft.start = Math.max(0, prevState.start - size)
				}
			})
		},
		undefined,
		() =>
			({
				start: INIT_START,
			}) satisfies ChunkerState,
	)

	return useMemo(() => {
		const { start } = state
		// Exclusive index
		const end = start + size
		const chunk = items.slice(start, end)
		const itemsAfter = Math.max(0, items.length - (state.start + size))

		return {
			chunk,
			end,
			itemsAfter,
			size,
			start,
			prevChunk: () => dispatch('prev'),
			nextChunk: () => dispatch('next'),
		}
	}, [state, items])
}
