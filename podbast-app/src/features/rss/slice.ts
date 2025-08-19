import { createSelector, createSlice } from '@reduxjs/toolkit'

import { buildUrl, log } from '/src/utils'
import { entries, Indexed, values, wrapEmpty } from '/src/utils/collections'

import { Feed } from './models'
import { fetchFeed } from './thunks'

const logger = log.with({ prefix: 'rss' })

export type RssPullMode = 'auto' | 'manual'

export type RssPullBase = {
	url: string
	status: string
	mode: RssPullMode
	requestedBy?: string
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
				const { url: urlParts, mode = 'auto', requestedBy } = action.meta.arg
				const url = buildUrl(urlParts).toString()

				const existing = draft.urlToPull[url]
				if (existing) {
					existing.status = 'requested'
					existing.mode = mode
					existing.requestedBy = requestedBy
					return
				}

				draft.urlToPull[url] = {
					url,
					mode,
					requestedBy,
					status: 'requested',
				}
			})
			.addCase(fetchFeed.fulfilled, (draft, action) => {
				const feed = action.payload
				const { url: urlParts, requestedBy } = action.meta.arg
				const url = buildUrl(urlParts).toString()

				const existing = draft.urlToPull[url]
				if (!existing) {
					logger.error('Fulfilled missing feed pull')
					return
				}

				if (
					(requestedBy && feed.feedUrl !== requestedBy) ||
					feed.feedKey !== requestedBy
				) {
					logger.error('Fulfilled feedKey does not match requested feedKey')
				}

				existing.status = 'ready'
				existing.feed = feed
			})
			.addCase(fetchFeed.rejected, (draft, action) => {
				const { url: urlParts } = action.meta.arg
				logger.error('fetchFeed.rejected', { urlParts })

				const url = buildUrl(urlParts).toString()

				const existing = draft.urlToPull[url]
				if (!existing) {
					logger.error('Rejected missing feed pull')
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
		wrapEmpty(
			values(urlToPull).filter(
				pull => pull.status === status && pull.mode === 'auto',
			),
		),
)

export const selectPullStatus = createSelector(
	[selectUrlToPull, (_, url: string) => url],
	(urlToPull, url) => urlToPull[url]?.status,
)

export const { actions, reducer } = slice
export const { clearPending, clearPull } = actions
