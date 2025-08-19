import { RssPullMode } from '/src/features/rss/slice'
import { createAppAsyncThunk } from '/src/store'
import { buildUrl } from '/src/utils'

import { getFeed } from './rssClient'

type FFArg = {
	url: string
	mode?: RssPullMode
	requestedBy?: string
}

export const fetchFeed = createAppAsyncThunk(
	'rss/fetchFeed',
	async ({ requestedBy, url }: FFArg, _thunkAPI) => {
		const response = await getFeed(buildUrl(url))

		response['feedKey'] = requestedBy
		return response
	},
)
