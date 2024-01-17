import { Box, Button, List, ListItem } from '@chakra-ui/react'
import { useReducer } from 'preact/hooks'

import { play } from '/src/features/player/slice'
import { Feed } from '/src/features/rss/guards'
import { useAppDispatch, useAppSelector } from '/src/store'

import { LOCAL_URLS } from './rssClient'
import { makeReady, requestPull, selectPullsByStatus } from './slice'
import { fetchFeed } from './thunks'

const FeedViewer = ({ feed }: { feed: Feed }) => {
	const dispatch = useAppDispatch()

	return (
		<Box>
			<p>
				<strong>{feed.title}</strong>
			</p>
			<ul style={{ lineHeight: '2.1rem' }}>
				{feed.items.map(fi => (
					<li>
						<Button
							onClick={() => {
								dispatch(
									play({
										title: fi.title,
										url: fi.enclosure.url,
									}),
								)
							}}
						>
							▶
						</Button>
						<span style={{ fontStyle: 'italic' }}>{fi.title}</span>
					</li>
				))}
			</ul>
		</Box>
	)
}

export const Rss = () => {
	const dispatch = useAppDispatch()

	const requestedPulls = useAppSelector(state =>
		selectPullsByStatus(state, 'requested'),
	)
	const readyPulls = useAppSelector(state =>
		selectPullsByStatus(state, 'ready'),
	)

	const [_, rerender] = useReducer(p => p + 1, 0)

	return (
		<>
			<Box>
				<h1>RSS Stuff</h1>

				<Button onClick={() => rerender(0)}>Rerender</Button>

				<Box>
					<p> Previous URLS:</p>
					<ul>
						{LOCAL_URLS.map(u => (
							<li key={u}>
								<pre style={{ display: 'inline' }}>{u}</pre>

								<Button
									onClick={() => {
										const inputEl: HTMLInputElement =
											document.querySelector('input[name=url]')!
										inputEl.value = u
									}}
								>
									Use
								</Button>
							</li>
						))}
					</ul>

					<form
						onSubmit={evt => {
							evt.preventDefault()
							const urlEl = evt.currentTarget.elements.namedItem('url')
							const url = (urlEl as HTMLInputElement).value
							dispatch(requestPull(url))
							const ff = fetchFeed(url)
							console.log('ff', ff)
							dispatch(ff)
						}}
					>
						<input type="text" name="url" placeholder="rss.url.com"></input>
						<Button type="submit">Request</Button>
					</form>
				</Box>

				<h2>Requested</h2>
				<List>
					{requestedPulls.map(ru => (
						<ListItem key={ru.url}>
							[{ru.status}] {ru.url}
							<Button
								onClick={() => {
									dispatch(makeReady(ru.url))
								}}
							>
								Make ready
							</Button>
						</ListItem>
					))}
				</List>

				<h2>Ready</h2>
				<Box
					style={{
						maxHeight: '40vh',
						overflowY: 'auto',
					}}
				>
					<ul>
						{readyPulls.map(ru => (
							<li key={ru.url}>
								<FeedViewer feed={ru.feed!} />
							</li>
						))}
					</ul>
				</Box>
			</Box>
		</>
	)
}
