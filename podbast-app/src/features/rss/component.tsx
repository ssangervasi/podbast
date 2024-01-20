import {
	Box,
	Button,
	Heading,
	Input,
	List,
	ListItem,
	Text,
	UnorderedList,
	VStack,
} from '@chakra-ui/react'

import { play } from '/src/features/player'
import { Feed } from '/src/features/rss/guards'
import { useAppDispatch, useAppSelector } from '/src/store'

import { LOCAL_URLS } from './rssClient'
import { makeReady, requestPull, selectPullsByStatus } from './slice'
import { fetchFeed } from './thunks'

const FeedViewer = ({ feed }: { feed: Feed }) => {
	const dispatch = useAppDispatch()

	return (
		<Box>
			<Text bold>{feed.title}</Text>

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

	return (
		<>
			<Box>
				<Heading>RSS Stuff</Heading>

				<Box>
					<Text as="b"> Previous URLS:</Text>
					<UnorderedList>
						{LOCAL_URLS.map(u => (
							<ListItem key={u}>
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
							</ListItem>
						))}
					</UnorderedList>

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
						<VStack align="start">
							<Input type="text" name="url" placeholder="rss.url.com"></Input>
							<Button type="submit">Request</Button>
						</VStack>
					</form>
				</Box>

				<Heading>Requested</Heading>
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

				<Heading>Ready</Heading>
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
