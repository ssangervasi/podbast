import { createAsyncThunk } from '@reduxjs/toolkit'

import {
	_receiveMediaUpdate as player_receiveMediaUpdate,
	selectMedia,
} from '/src/features/player/slice'
import { _receiveMediaUpdate as subscriptions_receiveMediaUpdate } from '/src/features/subscriptions/slice'
import type { RootState } from '/src/store/store'

// import { _receiveMediaUpdate } from './slice'

export const updateMedia = createAsyncThunk(
	'player/updateMedia',
	async (
		mediaUpdate: {
			currentTime: number
		},
		thunkAPI,
	) => {
		thunkAPI.dispatch(player_receiveMediaUpdate(mediaUpdate))

		const media = selectMedia(thunkAPI.getState() as RootState)
		thunkAPI.dispatch(
			subscriptions_receiveMediaUpdate({
				...media!,
				...mediaUpdate,
			}),
		)
		// const response = await getFeed(feedUrl)
		// return response
	},
)
