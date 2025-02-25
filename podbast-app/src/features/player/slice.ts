import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { log } from '/src/utils'

import { SubscriptionItemIndex } from '../subscriptions/models'

/**
 * Just the item stuff we need within the player
 */
export type MediaItem = SubscriptionItemIndex & {}

export type Media = {
	src: string
	title?: string
	item?: MediaItem
	currentTime?: number
	durationTime?: number
}

export type MediaUpdate = {
	status: Status
	media?: Media
	volume?: number
}

/**
 * Would be called "state" except that's confusing with RTK state.
 */
export type Status = 'stopped' | 'paused' | 'playing'

export type PlayerState = {
	status: Status
	media?: Media
	pendingRequest?: MediaUpdate
	volume?: number
}

export const initialState: PlayerState = {
	status: 'stopped',
}

export const slice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		makeRequest: (state, action: PayloadAction<MediaUpdate>) => {
			state.pendingRequest = action.payload
		},
		_clearRequest(state) {
			if (!state.pendingRequest) {
				log.warn('Clearing no pending request')
				return
			}
			state.status = state.pendingRequest.status
			state.media = state.pendingRequest.media
			state.volume = state.pendingRequest.volume
			state.pendingRequest = undefined
		},
		_receiveMediaUpdate: (state, action: PayloadAction<MediaUpdate>) => {
			const mediaUpdate = action.payload
			state.status = mediaUpdate.status
			state.media = mediaUpdate.media
			state.volume = mediaUpdate.volume
		},
	},
	selectors: {
		selectState: state => state,
		selectStatus: state => state.status,
		selectMedia: state => state.media,
		selectPendingRequest: state => state.pendingRequest,
		selectVolume: state => state.volume,
	},
})

export const { actions, reducer } = slice
export const { makeRequest, _receiveMediaUpdate, _clearRequest } = actions
export const { selectState, selectStatus, selectMedia, selectPendingRequest } =
	slice.selectors
