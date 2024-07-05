import { useCallback, useEffect, useMemo } from 'preact/hooks'

import { useAppDispatch, useAppSelector } from '/src/store'
import { identity } from '/src/utils/typemagic'

import {
	AnyLayoutData,
	LayoutName,
	LayoutNamesWithData,
	LayoutNamesWithoutData,
	LAYOUTS,
	PickLayoutData,
} from './layouts'
import { actions, selectLayout } from './slice'

type ShowO = {
	<N extends LayoutNamesWithoutData>(name: N): void
	<N extends LayoutNamesWithData>(name: N, data: PickLayoutData<N>): void
}

export const useLayout = () => {
	const dispatch = useAppDispatch()

	const { layout: layoutName, data: layoutData } = useAppSelector(selectLayout)
	const layout = LAYOUTS[layoutName]

	const show = useCallback(
		identity<ShowO>((name: LayoutName, data?: AnyLayoutData) => {
			dispatch(actions.show({ name, data }))
		}),
		[],
	)

	const ensureData = useCallback(
		<N extends LayoutNamesWithData>(name: N): PickLayoutData<N> => {
			if (name === layoutName) {
				return layoutData as PickLayoutData<N>
			}
			throw new Error('Layout data does not match')
		},
		[layoutName, layoutData],
	)

	const onLayout = <N extends LayoutNamesWithData>(
		name: N,
		handleLayout: (layoutData: PickLayoutData<N>) => void,
	): void => {
		useEffect(() => {
			if (name === layoutName) {
				handleLayout(ensureData(name))
			}
		}, [layoutName])
	}

	const res = useMemo(
		() => ({
			layout,
			layoutName,
			show,
			ensureData,
			onLayout,
		}),
		[
			//
			layout,
			layoutData,
			show,
			ensureData,
			onLayout,
		],
	)

	return res
}
