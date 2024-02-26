import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'

import { FEED } from '/src/features/rss/fixtures'
import { Feed } from '/src/features/rss/guards'
import { EMPTY_ARRAY, wrapEmpty } from '/src/store/utils'
import { log } from '/src/utils'

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
				log.info('makeReady: No subscription for url')
				return
			}

			pull.status = 'ready'
			pull.feed = FEED
		},
		clearPending: state => {
			state.pulls = state.pulls.filter(p => {
				if (p.status !== 'ready') {
					return false
				}
				return true
			})
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchFeed.pending, (_, action) => {
				log.info('fetchFeed.pending', { action })
			})
			.addCase(fetchFeed.fulfilled, (state, action) => {
				log.info('fetchFeed.fulfilled', { action })

				const rsub = state.pulls.find(ruc => ruc.url === action.meta.arg)

				const attrs = {
					status: 'ready',
					feed: action.payload,
				}

				if (rsub) {
					Object.assign(rsub, attrs)
				} else {
					log.info('No RU for feed fulf')
				}
			})
			.addCase(fetchFeed.rejected, (_, action) => {
				log.info('fetchFeed.v', { action })
			})
	},
	selectors: {
		selectPulls: (state): RssPull[] => state.pulls,
	},
})

export const { selectPulls } = slice.selectors

export const selectPullsByStatus = createSelector(
	[selectPulls, (_, status: RssPull['status']) => status],
	(pulls, status) => {
		log.info('selecty', pulls, status)
		return wrapEmpty(pulls.filter(ru => ru.status === status))
	},
)

export const { actions, reducer } = slice
export const { makeReady, requestPull, clearPending } = actions
