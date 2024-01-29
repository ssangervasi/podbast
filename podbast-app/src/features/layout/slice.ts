import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

type LayoutName = 'rss' | 'subscriptions'

export interface CommonState {
	layout: LayoutName
}

export const initialState: CommonState = {
	layout: 'subscriptions',
}

export const slice = createSlice({
	name: 'layout',
	initialState,
	reducers: {
		show: (state, action: PayloadAction<LayoutName>) => {
			state.layout = action.payload
		},
	},
	selectors: { selectLayout: state => state.layout },
})

export const { actions, reducer, selectors } = slice
export const { selectLayout } = selectors
