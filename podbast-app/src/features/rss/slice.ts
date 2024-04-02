import { createSelector, createSlice } from '@reduxjs/toolkit'

import { log } from '/src/utils'

import { EMPTY_ARRAY, mapToMap, wrapEmpty } from '../../utils/collections'
import { Feed } from './models'
import { fetchFeed } from './thunks'

export type RssPullBase = {
	url: string
	status: string
	feed?: Feed
}

export type RssPullRequested = RssPullBase & {
	status: 'requested'
}

export type RssPullReady = RssPullBase & {
	status: 'ready'
	feed: Feed
}

export type RssPullNotFound = RssPullBase & {
	status: 'notFound'
}

export type RssPull = RssPullRequested | RssPullReady | RssPullNotFound

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
			.addCase(fetchFeed.pending, (state, action) => {
				const { feedUrl } = action.meta.arg
				log.info('fetchFeed.pending', { feedUrl })

				const existing = state.pulls.find(ru => ru.url === feedUrl)
				if (existing) {
					existing.status = 'requested'
					return
				}

				state.pulls.push({
					url: feedUrl,
					status: 'requested',
				})
			})
			.addCase(fetchFeed.fulfilled, (state, action) => {
				const { feedUrl } = action.meta.arg
				log.info('fetchFeed.fulfilled', { feedUrl })

				const pull = state.pulls.find(ruc => ruc.url === feedUrl)

				if (!pull) {
					log.error('Fulfilled missing feed pull')
					return
				}

				pull.status = 'ready'
				pull.feed = action.payload
			})
			.addCase(fetchFeed.rejected, (state, action) => {
				const { feedUrl } = action.meta.arg
				log.error('fetchFeed.rejected', { feedUrl })

				const pull = state.pulls.find(ruc => ruc.url === feedUrl)
				if (!pull) {
					log.error('Rejected missing feed pull')
					return
				}
				pull.status = 'notFound'
			})
	},
	selectors: {
		selectPulls: (state): RssPull[] => state.pulls,
	},
})

export const { selectPulls } = slice.selectors

export const selectFeedUrlToPull = createSelector([selectPulls], pulls =>
	mapToMap(pulls, pull => [pull.url, pull]),
)

export const selectPullsByStatus = createSelector(
	[selectPulls, (_, status: RssPull['status']) => status],
	(pulls, status) => wrapEmpty(pulls.filter(ru => ru.status === status)),
)

export const { actions, reducer } = slice
export const { clearPending } = actions
