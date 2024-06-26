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

import { Outline, OutlineFeed } from '/src/features/rss'
import { postOpml } from '/src/features/rss/opmlClient'
import { fetchFeed } from '/src/features/rss/thunks'
import { useAppDispatch, useAppSelector } from '/src/store'
import { PageStack, TinyForm } from '/src/ui'
import { PageGrid, RowWrapper } from '/src/ui/grids'

import { PullViewer } from './FeedViewer'
import { LocalUrlForm } from './LocalUrlForm'
import { clearPending, selectManualPulls } from './slice'

export const AddFeedPage = () => {
	const dispatch = useAppDispatch()

	const pulls = useAppSelector(selectManualPulls)

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
		dispatch(fetchFeed({ url, mode: 'manual' }))
	}, [])

	return (
		<PageStack>
			<Heading as="h1">Load RSS feed</Heading>

			<LocalUrlForm />

			<chakra.form
				name="inputRssUrl"
				onSubmit={handleSubmitRssUrl}
				width="full"
			>
				<chakra.p>Load a podcast by RSS feed</chakra.p>

				<TinyForm>
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
				</TinyForm>
			</chakra.form>

			<UploadForm />

			<Heading>Loaded feeds</Heading>
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

const UploadForm = () => {
	const dispatch = useAppDispatch()

	const [outline, setOutline] = useState<Outline>()

	const handleSubmit = useCallback(async (evt: SubmitEvent) => {
		evt.preventDefault()
		if (!(evt.currentTarget instanceof HTMLFormElement)) {
			return
		}
		const opmlForm = new FormData(evt.currentTarget)
		const resOutline = await postOpml(opmlForm)
		resOutline.feeds.sort((fl, fr) => (fl.title < fr.title ? -1 : 1))
		setOutline(resOutline)
	}, [])

	const handleLoad = useCallback(async (outlineFeed: OutlineFeed) => {
		dispatch(fetchFeed({ url: outlineFeed.url, mode: 'manual' }))
	}, [])

	return (
		<>
			<chakra.p>
				Or import a list of RSS feeds. The supported file format is OPML, which
				the format Google Podcasts (
				<Link href="https://killedbygoogle.com/">RIP</Link>) used.
			</chakra.p>

			<chakra.form name="importFeedList" onSubmit={handleSubmit} width="full">
				<TinyForm>
					<FormControl>
						<FormLabel>RSS feed list</FormLabel>
						<Input type="file" name="content" padding={1} isRequired></Input>
					</FormControl>
					<Button type="submit">Upload</Button>
				</TinyForm>
			</chakra.form>

			<Heading>Importable feeds</Heading>
			<PageGrid>
				{outline
					? outline.feeds.map(f => (
							<RowWrapper key={f.url} data-testid={`UploadForm-row:${f.title}`}>
								<GridItem colSpan={3}>
									<chakra.b fontSize="lg">{f.title}</chakra.b>
								</GridItem>
								<GridItem colSpan={8} data-testid="UploadForm-url">
									<chakra.span fontFamily="monospace">{f.url}</chakra.span>
								</GridItem>
								<GridItem colSpan={1}>
									<Button onClick={() => handleLoad(f)}>Load</Button>
								</GridItem>
							</RowWrapper>
						))
					: null}
			</PageGrid>
		</>
	)
}
