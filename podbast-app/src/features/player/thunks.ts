// import throttle from 'lodash.throttle'

// import {
// 	_receiveMediaUpdate as player_receiveMediaUpdate,
// 	type MediaUpdate,
// } from '/src/features/player/slice'
// import { _receiveMediaUpdate as subscriptions_receiveMediaUpdate } from '/src/features/subscriptions/slice'
// import { createAppAsyncThunk } from '/src/store'
// // import type { RootState } from '/src/store/store'

// const throttledWrapper = throttle((f: () => void) => {
// 	f()
// }, 5_000)

// export const updateMedia = createAppAsyncThunk(
// 	'player/updateMedia',
// 	async (mediaUpdate: MediaUpdate, thunkAPI) => {
// 		// Immediately sync status changes to the player slice.
// 		const prevStatus = thunkAPI.getState().player.status
// 		if (mediaUpdate.status !== prevStatus) {
// 			thunkAPI.dispatch(player_receiveMediaUpdate(mediaUpdate))
// 			return
// 		}

// 		// Throttle time updates
// 		throttledWrapper(() => {
// 			thunkAPI.dispatch(player_receiveMediaUpdate(mediaUpdate))
// 			thunkAPI.dispatch(subscriptions_receiveMediaUpdate(mediaUpdate))
// 		})
// 	},
// )
