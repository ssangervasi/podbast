#!/usr/bin/env node
import path from 'node:path'
import concurrently from 'concurrently'

// https://github.com/open-cli-tools/concurrently/issues/399
const { result } = concurrently(
	[
		{
			name: 'server-builder',
			cwd: './podbast-server',
			command: 'npm run build:watch',
		},
		{
			name: 'server',
			cwd: './podbast-server',
			command: 'npm run start:watch',
			env: {
				NODE_ENV: 'development',
			},
		},
		{
			name: 'app-dev',
			cwd: './podbast-app',
			command: 'npm run dev',
		},
	],
	{
		killOthers: [
			'failure',
			// 'success'
		],
		restartTries: 0,
		// raw: true,
		cwd: path.resolve(import.meta.dirname, '..'),
	},
)

await result
