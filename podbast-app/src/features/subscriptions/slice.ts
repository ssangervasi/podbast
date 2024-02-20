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
	selectors: {
		selectSubscriptions: state => state,
		selectFeedSubscription: (state, url: string) =>
			state.find(sub => sub.url === url),
	},
})

export const { actions, reducer, selectors } = slice
export const { subscribe } = actions
export const { selectSubscriptions, selectFeedSubscription } = selectors
