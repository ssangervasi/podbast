import { createSelector, createSlice } from '@reduxjs/toolkit'

import { buildUrl, log } from '/src/utils'
import { entries, Indexed, values, wrapEmpty } from '/src/utils/collections'

import { Feed } from './models'
import { fetchFeed } from './thunks'

export type RssPullMode = 'auto' | 'manual'

export type RssPullBase = {
	url: string
	status: string
	mode: RssPullMode
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
	urlToPull: Indexed<RssPull>
}

export const initialState: RssState = {
	urlToPull: {},
}

export const slice = createSlice({
	name: 'rss',
	initialState,
	reducers: create => ({
		clearPending: create.reducer(draft => {
			entries(draft.urlToPull).forEach(([url, pull]) => {
				if (pull.status !== 'ready') {
					delete draft.urlToPull[url]
				}
			})
		}),
		clearPull: create.reducer<string>((draft, action) => {
			const url = action.payload
			delete draft.urlToPull[url]
		}),
	}),
	extraReducers: builder => {
		builder
			.addCase(fetchFeed.pending, (draft, action) => {
				const { url: urlParts, mode = 'auto' } = action.meta.arg
				log.debug('fetchFeed.pending', { urlParts, mode })

				const url = buildUrl(urlParts).toString()

				const existing = draft.urlToPull[url]
				if (existing) {
					existing.status = 'requested'
					existing.mode = mode
					return
				}

				draft.urlToPull[url] = {
					url,
					mode,
					status: 'requested',
				}
			})
			.addCase(fetchFeed.fulfilled, (draft, action) => {
				const { url: urlParts } = action.meta.arg
				log.debug('fetchFeed.fulfilled', { urlParts })

				const url = buildUrl(urlParts).toString()

				const existing = draft.urlToPull[url]
				if (!existing) {
					log.error('Fulfilled missing feed pull')
					return
				}

				existing.status = 'ready'
				existing.feed = action.payload
			})
			.addCase(fetchFeed.rejected, (draft, action) => {
				const { url: urlParts } = action.meta.arg
				log.error('fetchFeed.rejected', { urlParts })

				const url = buildUrl(urlParts).toString()

				const existing = draft.urlToPull[url]
				if (!existing) {
					log.error('Rejected missing feed pull')
					return
				}

				existing.status = 'notFound'
			})
	},
	selectors: {
		selectState: state => state,
	},
})

const { selectState } = slice.selectors

export const selectUrlToPull = createSelector(
	[selectState],
	({ urlToPull }) => urlToPull,
)

export const selectManualPulls = createSelector([selectUrlToPull], urlToPull =>
	wrapEmpty(values(urlToPull).filter(pull => pull.mode === 'manual')),
)

export const selectPullsByStatus = createSelector(
	[selectUrlToPull, (_, status: RssPull['status']) => status],
	(urlToPull, status) =>
		wrapEmpty(values(urlToPull).filter(ru => ru.status === status)),
)

export const selectPullStatus = createSelector(
	[selectUrlToPull, (_, url: string) => url],
	(urlToPull, url) => urlToPull[url]?.status,
)

export const { actions, reducer } = slice
export const { clearPending, clearPull } = actions
