import {
	Button,
	chakra,
	FormControl,
	FormLabel,
	GridItem,
	Heading,
	Input,
	Link,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { Fragment } from 'preact/jsx-runtime'

import { Outline, OutlineFeed } from '/src/features/rss'
import { PullViewer } from '/src/features/rss/feedViewer'
import { postOpml } from '/src/features/rss/opmlClient'
import { fetchFeed } from '/src/features/rss/thunks'
import { useAppDispatch, useAppSelector } from '/src/store'
import { HStack, PageStack } from '/src/ui'
import { PageGrid } from '/src/ui/grids'

import { LocalUrlForm } from './LocalUrlForm'
import { clearPending, selectPulls } from './slice'

export const AddFeedPage = () => {
	const dispatch = useAppDispatch()

	const pulls = useAppSelector(selectPulls)

	useEffect(() => {
		dispatch(clearPending())
	}, [])

	const handleSubmitRssUrl = useCallback(async (evt: SubmitEvent) => {
		evt.preventDefault()
		if (!(evt.currentTarget instanceof HTMLFormElement)) {
			return
		}
		const urlEl = evt.currentTarget.elements.namedItem('url')
		if (!(urlEl instanceof HTMLInputElement)) {
			return
		}
		const url = urlEl.value
		dispatch(fetchFeed({ url }))
	}, [])

	return (
		<PageStack>
			<Heading as="h1" size="lg">
				Load RSS feed
			</Heading>

			<LocalUrlForm />

			<form name="inputRssUrl" onSubmit={handleSubmitRssUrl}>
				<chakra.p>Load a podcast by RSS feed</chakra.p>

				<HStack alignItems="end">
					<FormControl>
						<FormLabel>RSS URL</FormLabel>
						<Input
							type="url"
							name="url"
							placeholder="rss.url.com"
							isRequired
						></Input>
					</FormControl>

					<Button type="submit">Load</Button>
				</HStack>
			</form>

			<ImportForm />

			<Heading as="h2" size="lg">
				Loaded feeds
			</Heading>
			<PageGrid>
				{pulls.length === 0 ? (
					<GridItem colSpan={12}>
						<chakra.i>... load a feed</chakra.i>
					</GridItem>
				) : null}

				{pulls.map(p => (
					<PullViewer key={p.url} pull={p} />
				))}
			</PageGrid>
		</PageStack>
	)
}

// const

const ImportForm = () => {
	const dispatch = useAppDispatch()

	const [outline, setOutline] = useState<Outline>()

	const handleSubmit = useCallback(async (evt: SubmitEvent) => {
		evt.preventDefault()
		if (!(evt.currentTarget instanceof HTMLFormElement)) {
			return
		}
		const opmlForm = new FormData(evt.currentTarget)
		const resOutline = await postOpml(opmlForm)
		setOutline(resOutline)
	}, [])

	const handleLoad = useCallback(async (outlineFeed: OutlineFeed) => {
		dispatch(fetchFeed({ url: outlineFeed.url, mode: 'manual' }))
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
						<Input type="file" name="content" padding={1} isRequired></Input>
					</FormControl>
					<Button type="submit">Import</Button>
				</HStack>
			</form>

			<Heading as="h2" size="lg">
				Importable feeds
			</Heading>
			<PageGrid>
				{outline
					? outline.feeds.map(f => (
							<Fragment key={f.url}>
								<GridItem colSpan={3}>
									<chakra.b fontSize="lg">{f.title}</chakra.b>
								</GridItem>
								<GridItem colSpan={8}>
									<chakra.span fontFamily="monospace">{f.url}</chakra.span>
								</GridItem>
								<GridItem colSpan={1}>
									<Button onClick={() => handleLoad(f)}>Load</Button>
								</GridItem>
							</Fragment>
						))
					: null}
			</PageGrid>
		</>
	)
}
