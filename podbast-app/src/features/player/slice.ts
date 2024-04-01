import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export type Media = {
	title: string
	url: string
	currentTime?: number
}

export type PlayRequest = {
	status: Status
	media?: Media
}

/**
 * Would be called "state" except that's confusing with RTK state.
 */
export type Status = 'stopped' | 'paused' | 'playing'

export type PlayerState = {
	status: Status
	media?: Media
	pendingRequest?: PlayRequest
}

export const initialState: PlayerState = {
	status: 'stopped',
}

export const slice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		play: (state, action: PayloadAction<Media>) => {
			const media = action.payload

			state.media = media
			state.pendingRequest = {
				status: 'playing',
				media,
			}
		},
		_clearRequest(state) {
			// Race condition?
			state.pendingRequest = undefined
		},
		_receiveMediaUpdate: (
			state,
			action: PayloadAction<{ currentTime: number }>,
		) => {
			if (!state.media) {
				return
			}
			state.media.currentTime = action.payload.currentTime
		},
	},
	selectors: {
		selectStatus: state => state.status,
		selectMedia: state => state.media,
		selectPendingRequest: state => state.pendingRequest,
	},
})

export const { actions, reducer } = slice
export const { play, _receiveMediaUpdate, _clearRequest } = actions
export const { selectStatus, selectMedia, selectPendingRequest } =
	slice.selectors
