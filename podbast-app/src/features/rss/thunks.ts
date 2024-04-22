import { createAsyncThunk } from '@reduxjs/toolkit'

import { RssPullMode } from '/src/features/rss/slice'
import { buildUrl, UrlIsh } from '/src/utils'

import { getFeed } from './rssClient'

type FFArg = { url: UrlIsh; mode?: RssPullMode }

export const fetchFeed = createAsyncThunk(
	'rss/fetchFeed',
	async ({ url }: FFArg, _thunkAPI) => {
		const response = await getFeed(buildUrl(url))
		return response
	},
)

// import { RootState } from '/src/store/store'
// Kinda works
// const cat = createAsyncThunk.withTypes<{
// 	state: RootState
// 	pendingMeta: {
// 		urlParts: UrlParts
// 	}
// }>()

// export const fetchFeed = cat(
// 	'rss/fetchFeed',
// 	async ({ url }: FFArg, _thunkAPI) => {
// 		_thunkAPI.getState()
// 		const response = await getFeed(buildUrl(url))
// 		return response
// 	},
// 	{
// 		getPendingMeta: meta => {
// 			return { urlParts: buildUrlParts(meta.arg.url) }
// 		},
// 	},
// )
