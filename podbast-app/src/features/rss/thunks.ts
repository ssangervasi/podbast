import { RssPullMode } from '/src/features/rss/slice'
import { createAppAsyncThunk } from '/src/store'
import { buildUrl } from '/src/utils'

import { getFeed } from './rssClient'

type FFArg = { url: string; mode?: RssPullMode }

export const fetchFeed = createAppAsyncThunk(
	'rss/fetchFeed',
	async ({ url }: FFArg, _thunkAPI) => {
		const response = await getFeed(buildUrl(url))
		return response
	},
)

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
