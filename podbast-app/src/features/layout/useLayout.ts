import { useCallback, useMemo } from 'preact/hooks'

import { useAppDispatch, useAppSelector } from '/src/store'

import {
	AnyLayoutData,
	LayoutName,
	LayoutNamesWithData,
	LayoutNamesWithoutData,
	LAYOUTS,
	PickLayoutData,
} from './layouts'
import { actions, selectLayout } from './slice'

const ident = <V>(v: V): V => v

type F = {
	<N extends LayoutNamesWithoutData>(name: N): void
	<N extends LayoutNamesWithData>(name: N, data: PickLayoutData<N>): void
}

export const useLayout = () => {
	const dispatch = useAppDispatch()

	const { layout: layoutName, data: layoutData } = useAppSelector(selectLayout)
	const layout = LAYOUTS[layoutName]

	const show = useCallback(
		ident<F>((name: LayoutName, data?: AnyLayoutData) => {
			dispatch(actions.show({ name, data }))
		}),
		[],
	)

	const res = useMemo(
		() => ({
			layout,
			layoutName,
			layoutData,
			show,
		}),
		[
			//
			layout,
			layoutData,
			layoutName,
			show,
		],
	)

	return res
}
