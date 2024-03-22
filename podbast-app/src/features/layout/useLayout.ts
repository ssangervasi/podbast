import { useCallback, useMemo } from 'preact/hooks'

import { useAppDispatch, useAppSelector } from '/src/store'

import { LAYOUTS } from './layouts'
import { actions, selectLayout } from './slice'

export const useLayout = () => {
	const dispatch = useAppDispatch()

	const layoutName = useAppSelector(selectLayout)
	const layout = LAYOUTS[layoutName]

	const show = useCallback((...args: Parameters<typeof actions.show>) => {
		dispatch(actions.show(...args))
	}, [])

	const res = useMemo(
		() => ({
			layout,
			layoutName,
			show,
		}),
		[layout, show],
	)

	return res
}
