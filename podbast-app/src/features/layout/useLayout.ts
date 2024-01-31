import { useCallback, useMemo } from 'preact/hooks'

import { useAppDispatch, useAppSelector } from '/src/store'

import { actions, selectLayout } from './slice'
export type { LayoutName } from './slice'

export const useLayout = () => {
	const layout = useAppSelector(selectLayout)

	const dispatch = useAppDispatch()

	const show = useCallback((...args: Parameters<typeof actions.show>) => {
		dispatch(actions.show(...args))
	}, [])

	const res = useMemo(
		() => ({
			layout,
			show,
		}),
		[layout, show],
	)

	return res
}
