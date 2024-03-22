import { createAsyncThunk } from '@reduxjs/toolkit'

import { getFeed } from './rssClient'

export const fetchFeed = createAsyncThunk(
	'rss/fetchFeed',
	async ({ feedUrl }: { feedUrl: string }, _thunkAPI) => {
		const response = await getFeed(feedUrl)
		return response
	},
)
