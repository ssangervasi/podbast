import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { createResetReducer } from '/src/store/utils'

export type LayoutName = 'rss' | 'subscriptions'

export interface LayoutState {
	layout: LayoutName
}

export const initialState: LayoutState = {
	layout: 'subscriptions',
}

export const slice = createSlice({
	name: 'layout',
	initialState,
	reducers: {
		show: (state, action: PayloadAction<LayoutName>) => {
			state.layout = action.payload
		},
		_reset: createResetReducer(initialState),
	},
	selectors: { selectLayout: state => state.layout },
})

export const { actions, reducer, selectors } = slice
export const { selectLayout } = selectors
