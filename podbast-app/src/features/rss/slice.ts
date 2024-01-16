import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { FEED } from '/src/features/rss/fixtures'
import { Feed } from '/src/features/rss/guards'
import { EMPTY_ARRAY, wrapEmpty } from '/src/store/utils'

import { fetchFeed } from './thunks'

export type RssPull = {
	url: string
} & (
	| {
			status: 'requested'
			feed?: undefined
	  }
	| {
			status: 'ready'
			feed: Feed
	  }
)

export interface RssState {
	pulls: RssPull[]
}

export const initialState: RssState = {
	pulls: EMPTY_ARRAY,
}

export const slice = createSlice({
	name: 'rss',
	initialState,
	reducers: {
		requestPull: (state, action: PayloadAction<string>) => {
			const url = action.payload

			const existing = state.pulls.find(ru => ru.url === url)
			if (existing) {
				existing.status = 'requested'
				return
			}

			state.pulls.push({
				url,
				status: 'requested',
			})
		},
		makeReady: (state, action: PayloadAction<string>) => {
			const url = action.payload
			const pull = state.pulls.find(p => p.url === url)
			if (!pull) {
				console.error('makeReady: No subscription for url')
				return
			}

			pull.status = 'ready'
			pull.feed = FEED
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchFeed.pending, () => {})
			.addCase(fetchFeed.fulfilled, (state, action) => {
				const rsub = state.pulls.find(ruc => ruc.url === action.meta.arg)

				const attrs = {
					status: 'ready',
					feed: action.payload,
				}

				if (rsub) {
					Object.assign(rsub, attrs)
				} else {
					console.error('No RU for feed fulf')
				}
			})
			.addCase(fetchFeed.rejected, () => {})
	},
	selectors: {
		selectPulls: (state): RssPull[] => state.pulls,
		selectPullsByStatus: (state, status: RssPull['status']): RssPull[] => {
			return wrapEmpty(
				slice
					.getSelectors()
					.selectPulls(state)
					.filter(ru => ru.status === status),
			)
		},
	},
})

export const { actions, reducer } = slice
export const { makeReady, requestPull } = actions
export const { selectPulls, selectPullsByStatus } = slice.selectors
