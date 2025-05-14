import { produce } from 'immer'
import { useEffect, useMemo, useReducer } from 'preact/hooks'

import { usePrevious } from '/src/utils'

const INIT_START = 0
const INIT_SIZE = 10

type ChunkerState = {
	start: number
}

export type Chunker<I> = {
	chunk: I[]
	end: number
	itemsAfter: number
	size: number
	start: number
	chunkInfo: {
		first: number
		last: number
		total: number
	}
	prevChunk: () => void
	nextChunk: () => void
}

export const useChunker = <I>({
	items,
	size: sizeOption,
}: {
	items: readonly I[]

	size?: number
}): Chunker<I> => {
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

	const prevItems = usePrevious(items)
	useEffect(() => {
		if (prevItems.length !== items.length) {
			dispatch('first')
		}
	}, [items, prevItems])

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
		} satisfies Chunker<I>
	}, [state, items])
}
