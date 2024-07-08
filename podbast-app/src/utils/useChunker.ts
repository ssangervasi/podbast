import { useMemo, useReducer } from 'preact/hooks'

const INIT_START = 0
const INIT_SIZE = 10

export const useChunker = <I>({
	items,
	size: sizeOption,
}: {
	items: readonly I[]

	size?: number
}) => {
	const size = useMemo(() => sizeOption ?? INIT_SIZE, [sizeOption])

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

		return {
			chunk,
			start,
			end,
			itemsAfter,
			nextChunk: () => dispatch('next'),
		}
	}, [state, items])
}
