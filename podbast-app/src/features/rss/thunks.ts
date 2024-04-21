import { createAsyncThunk } from '@reduxjs/toolkit'

import { getFeed } from './rssClient'
import { RssPullMode } from '/src/features/rss/slice'

export const fetchFeed = createAsyncThunk(
	'rss/fetchFeed',
	async (
		{ feedUrl, mode = 'auto' }: { feedUrl: string; mode?: RssPullMode },
		_thunkAPI,
	) => {
		const response = await getFeed(feedUrl)
		return response
	},
)
