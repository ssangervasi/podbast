import { createAsyncThunk } from '@reduxjs/toolkit'

import { getFeed } from './rssClient'

export const fetchFeed = createAsyncThunk(
	'rss/fetchFeed',
	async (url: string, _thunkAPI) => {
		console.log('fetchFeed')
		const response = await getFeed(url)
		return response
	},
)
