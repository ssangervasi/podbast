import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'

import { identity } from '/src/utils/typemagic'

import {
	AnyLayoutData,
	LayoutName,
	LayoutNamesWithData,
	LayoutNameToData,
} from './layouts'

export interface LayoutState {
	layout: LayoutName
	data: Partial<LayoutNameToData>
}

export const initialState: LayoutState = {
	layout: 'subscriptions',
	data: {},
}

export const slice = createSlice({
	name: 'layout',
	initialState,
	reducers: {
		show: (
			state,
			action: PayloadAction<{ name: LayoutName; data?: AnyLayoutData }>,
		) => {
			const { name, data } = action.payload
			state.layout = name
			state.data[name as keyof LayoutNameToData] = data
		},
	},
	selectors: {
		selectLayout: createSelector([identity], (state: LayoutState) => ({
			layout: state.layout,
			data:
				state.layout in state.data
					? state.data[state.layout as LayoutNamesWithData]
					: undefined,
		})),
	},
})

export const { actions, reducer, selectors } = slice
export const { selectLayout } = selectors
