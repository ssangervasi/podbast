import {
	Button,
	chakra,
	GridItem,
	Heading,
	Input,
	SimpleGrid,
} from '@chakra-ui/react'
import { useEffect } from 'preact/hooks'

import { PullViewer } from '/src/features/rss/feedViewer'
import { fetchFeed } from '/src/features/rss/thunks'
import { useAppDispatch, useAppSelector } from '/src/store'
import { HStack, VStack } from '/src/ui'

import { LocalUrlForm } from './LocalUrlForm'
import { clearPending, selectPulls } from './slice'

export const Rss = () => {
	const dispatch = useAppDispatch()

	const pulls = useAppSelector(selectPulls)

	useEffect(() => {
		dispatch(clearPending())
	}, [])

	return (
		<VStack>
			<Heading as="h1">Load RSS feed</Heading>

			<LocalUrlForm />

			<form
				onSubmit={evt => {
					evt.preventDefault()
					const urlEl = evt.currentTarget.elements.namedItem('url')
					const url = (urlEl as HTMLInputElement).value
					dispatch(fetchFeed({ feedUrl: url }))
				}}
			>
				<HStack align="start">
					<Input type="text" name="url" placeholder="rss.url.com"></Input>
					<Button type="submit">Load</Button>
				</HStack>
			</form>

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
