import {
	Button,
	chakra,
	FormControl,
	FormLabel,
	GridItem,
	Heading,
	Input,
	Link,
	SimpleGrid,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { PullViewer } from '/src/features/rss/feedViewer'
import { fetchFeed } from '/src/features/rss/thunks'
import { useAppDispatch, useAppSelector } from '/src/store'
import { HStack, VStack } from '/src/ui'

import { LocalUrlForm } from './LocalUrlForm'
import { clearPending, selectPulls } from './slice'

export const AddFeedPage = () => {
	const dispatch = useAppDispatch()

	const pulls = useAppSelector(selectPulls)

	useEffect(() => {
		dispatch(clearPending())
	}, [])

	return (
		<VStack>
			<Heading as="h1" size="lg">
				Load RSS feed
			</Heading>

			<LocalUrlForm />

			<form
				name="inputRssUrl"
				onSubmit={evt => {
					evt.preventDefault()
					const urlEl = evt.currentTarget.elements.namedItem('url')
					const url = (urlEl as HTMLInputElement).value
					dispatch(fetchFeed({ feedUrl: url }))
				}}
			>
				<chakra.p>Load a podcast by RSS feed</chakra.p>

				<HStack alignItems="end">
					<FormControl>
						<FormLabel>RSS URL</FormLabel>
						<Input type="text" name="url" placeholder="rss.url.com"></Input>
					</FormControl>

					<Button type="submit">Load</Button>
				</HStack>
			</form>

			<ImportForm />

			<Heading as="h2" size="lg">
				Results
			</Heading>
			<SimpleGrid
				columns={12}
				spacing={2}
				w="full"
				maxWidth={['full', 'container.lg']}
			>
				{pulls.length === 0 ? (
					<GridItem colSpan={12}>
						<chakra.i>... load a feed</chakra.i>
					</GridItem>
				) : null}

				{pulls.map(p => (
					<PullViewer key={p.url} pull={p} />
				))}
			</SimpleGrid>
		</VStack>
	)
}

const ImportForm = () => {
	const [response, setResponse] = useState<{
		status: number
		json: object
	}>()

	const handleSubmit = useCallback(async (evt: SubmitEvent) => {
		evt.preventDefault()
		if (!(evt.currentTarget instanceof HTMLFormElement)) {
			return
		}

		// const fileEl = evt.currentTarget.elements.namedItem('file')
		// if (!(fileEl instanceof HTMLInputElement)) {
		// 	return
		// }

		// const file = fileEl.files?.[0]
		// if (!file) {
		// 	return
		// }

		const res = await fetch('/api/opml', {
			method: 'POST',
			body: new FormData(evt.currentTarget),
		})
		let json
		try {
			json = await res.json()
		} catch {
			json = null
		}
		setResponse({
			status: res.status,
			json,
		})
	}, [])

	return (
		<>
			<form name="importFeedList" onSubmit={handleSubmit}>
				<chakra.p>
					Or import a list of RSS feeds. The supported file format is OPML,
					which the format Google Podcasts (
					<Link href="https://killedbygoogle.com/">RIP</Link>) used.
				</chakra.p>
				<HStack alignItems="end">
					<FormControl maxWidth="200px">
						<FormLabel>RSS feed list</FormLabel>
						<Input type="file" name="content" padding={1}></Input>
					</FormControl>
					<Button type="submit">Import</Button>
				</HStack>
			</form>

			<pre>{JSON.stringify(response, null, 2)}</pre>
		</>
	)
}
