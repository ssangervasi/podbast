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
}, 5_000)

export const updateMedia = createAsyncThunk(
	'player/updateMedia',
	async (mediaUpdate: MediaUpdate, thunkAPI) => {
		thunkAPI.dispatch(player_receiveMediaUpdate(mediaUpdate))

		throttledWrapper(() => {
			thunkAPI.dispatch(subscriptions_receiveMediaUpdate(mediaUpdate))
		})
	},
)
