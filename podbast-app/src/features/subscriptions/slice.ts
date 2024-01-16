import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export type Subscription = {
	url: string
	title: string
}

export type SubscriptionsState = Subscription[]

export const initialState: SubscriptionsState = []

export const slice = createSlice({
	name: 'subscriptions',
	initialState,
	reducers: {
		subscribe: (state, action: PayloadAction<Subscription>) => {
			state.push(action.payload)
		},
	},
})

export const { actions, reducer } = slice
