import {
	Box,
	Button,
	chakra,
	Heading,
	HStack,
	Input,
	List,
	ListItem,
	Text,
} from '@chakra-ui/react'
import { useEffect } from 'preact/hooks'

import { FeedViewer } from '/src/features/rss/feedViewer'
import { useAppDispatch, useAppSelector } from '/src/store'
import { VStack } from '/src/ui'
import { log } from '/src/utils'

import { LOCAL_URLS } from './rssClient'
import {
	clearPending,
	makeReady,
	requestPull,
	selectPullsByStatus,
} from './slice'
import { fetchFeed } from '/src/features/rss/thunks'

export const Rss = () => {
	const dispatch = useAppDispatch()

	// const requestedPulls = []
	const requestedPulls = useAppSelector(state =>
		selectPullsByStatus(state, 'requested'),
	)
	log.info(selectPullsByStatus)
	const readyPulls = useAppSelector(state => {
		console.log('use app')
		return selectPullsByStatus(state, 'ready')
	})

	// const { request: requestedPulls, ready: readyPulls } =
	// 	useAppSelector(selectStatusToPulls)

	useEffect(() => {
		dispatch(clearPending())
	}, [])

	return (
		<>
			<Box>
				<Heading>RSS Stuff</Heading>

				<VStack>
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
							dispatch(fetchFeed(url))
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
				{readyPulls.map(ru => (
					<FeedViewer key={ru.url} feed={ru.feed!} />
				))}
			</Box>
		</>
	)
}
