import { combineReducers } from 'redux'

import { slice as commonSlice } from '/src/features/common/slice'
import { slice as layoutSlice } from '/src/features/layout/slice'
import { slice as playerSlice } from '/src/features/player/slice'
import { slice as rssSlice } from '/src/features/rss/slice'
import { slice as subscriptionsSlice } from '/src/features/subscriptions/slice'

export const rootReducer = combineReducers({
	[commonSlice.name]: commonSlice.reducer,
	[layoutSlice.name]: layoutSlice.reducer,
	[playerSlice.name]: playerSlice.reducer,
	[rssSlice.name]: rssSlice.reducer,
	[subscriptionsSlice.name]: subscriptionsSlice.reducer,
})

export type RootReducerReturn = ReturnType<typeof rootReducer>
export type RootReducerKey = keyof RootReducerReturn
