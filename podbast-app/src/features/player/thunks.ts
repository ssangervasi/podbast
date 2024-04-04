import { createAsyncThunk } from '@reduxjs/toolkit'
import throttle from 'lodash.throttle'

import {
	_receiveMediaUpdate as player_receiveMediaUpdate,
	type MediaUpdate,
} from '/src/features/player/slice'
import { _receiveMediaUpdate as subscriptions_receiveMediaUpdate } from '/src/features/subscriptions/slice'
// import type { RootState } from '/src/store/store'

const throttledWrapper = throttle((f: () => void) => {
	f()
}, 1_000)

export const updateMedia = createAsyncThunk(
	'player/updateMedia',
	async (mediaUpdate: MediaUpdate, thunkAPI) => {
		// Maybe status changes shouldn't be throttled
		throttledWrapper(() => {
			thunkAPI.dispatch(player_receiveMediaUpdate(mediaUpdate))
			thunkAPI.dispatch(subscriptions_receiveMediaUpdate(mediaUpdate))
		})
	},
)
