import {
	Box,
	Button,
	Heading,
	HStack,
	Input,
	List,
	ListItem,
	Text,
} from '@chakra-ui/react'

import { FeedViewer } from '/src/features/rss/feedViewer'
import { useAppDispatch, useAppSelector } from '/src/store'
import { VStack } from '/src/ui'

import { LOCAL_URLS } from './rssClient'
import { makeReady, requestPull, selectPullsByStatus } from './slice'
import { fetchFeed } from './thunks'

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

				<VStack
				// alignItems="start"
				// alignItems="start"
				// backgroundColor="pink"
				>
					<Text as="b"> Previous URLS:</Text>
					<List spacing={2}>
						{LOCAL_URLS.map(u => (
							<ListItem key={u}>
								<HStack>
									<Button
										size="sm"
										onClick={() => {
											const inputEl: HTMLInputElement =
												document.querySelector('input[name=url]')!
											inputEl.value = u
										}}
									>
										Autofill
									</Button>

									<Text
										as="span"
										fontFamily="monospace"
										textOverflow="ellipsis"
									>
										{u}
									</Text>
								</HStack>
							</ListItem>
						))}
					</List>

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
				</VStack>

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
