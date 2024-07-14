import {
	Box,
	Button,
	chakra,
	FormControl,
	FormLabel,
	GridItem,
	Heading,
	Image,
	Input,
	InputGroup,
	InputLeftAddon,
	Spinner,
	Text,
} from '@chakra-ui/react'
import { useMemo, useReducer, useState } from 'preact/hooks'

import { useLayout } from '/src/features/layout/useLayout'
import { selectPullStatus } from '/src/features/rss/slice'
import { EpisodeRow } from '/src/features/subscriptions/EpisodeRow'
import { Subscription } from '/src/features/subscriptions/models'
import { useAppSelector } from '/src/store'
import { HStack, PageGrid, PageStack, VStack } from '/src/ui'
import { log, useChunker } from '/src/utils'

import { selectSubscriptionWithItems } from './slice'

const useHack = (x: number) => {
	const [s, inc] = useReducer(
		(prev, _: undefined) => {
			return { n: prev.n + x }
		},
		{ n: 0 },
	)

	return { s, inc: () => inc(undefined) }
}

const Hack = () => {
	const x = Math.random() > 0.5 ? 10 : 5
	const { s, inc } = useHack(x)

	return (
		<div>
			<button
				onClick={() => {
					inc()
				}}
			>
				{s.n}
			</button>
		</div>
	)
}

export const SubscriptionDetailsPage = () => {
	const { ensureData } = useLayout()

	const { feedUrl } = ensureData('subscriptionDetails')
	const subscription = useAppSelector(state =>
		selectSubscriptionWithItems(state, feedUrl),
	)

	// const filters = useState(()

	const chunker = useChunker({ items: subscription.items, size: 15 })

	return (
		<>
			<PageStack>
				<Hack />
				<HStack>
					<Image
						src={subscription.image?.url}
						objectFit="cover"
						maxW="50px"
						data-testid="SubscriptionDetailsPage-image"
					/>
					<Heading as="h1">{subscription.title}</Heading>
				</HStack>
				<VStack>
					<Text>
						Homepage:{' '}
						<chakra.span fontFamily="monospace">
							{subscription.link}
						</chakra.span>
					</Text>
					<Text>
						Feed URL:{' '}
						<chakra.span fontFamily="monospace">
							{subscription.feedUrl}
						</chakra.span>
					</Text>
					<Text>
						Subscription URL:{' '}
						<chakra.span fontFamily="monospace">{subscription.url}</chakra.span>
						<br />
						(Includes authentication parameters, if any)
					</Text>
				</VStack>

				<Heading as="h2">Episodes</Heading>

				<PageGrid>
					<GridItem colSpan={6}>Filter</GridItem>
					<GridItem colSpan={6}>
						<HStack placeItems="center">
							<Button variant="link">clear</Button>
							<InputGroup>
								<FormControl>
									<FormLabel>after</FormLabel>
									<Input type="date" />
								</FormControl>
								<FormControl>
									<FormLabel>before</FormLabel>
									<Input type="date" />
								</FormControl>
							</InputGroup>
						</HStack>
					</GridItem>

					{chunker.chunk.map(item => (
						<EpisodeRow key={item.id} episode={{ subscription, item }} />
					))}

					{chunker.itemsAfter > 0 ? (
						<GridItem colSpan={12}>... and {chunker.itemsAfter} more</GridItem>
					) : null}

					<SubscriptionLoadingRow subscription={subscription} />

					<GridItem colSpan={12}>
						<Button onClick={chunker.nextChunk}>Next page</Button>
					</GridItem>
				</PageGrid>
			</PageStack>
		</>
	)
}

const SubscriptionLoadingRow = ({
	subscription,
}: {
	subscription: Subscription
}) => {
	const status = useAppSelector(state =>
		selectPullStatus(state, subscription.url),
	)

	if (status === undefined) {
		return null
	}

	return (
		<GridItem colSpan={12}>
			<Spinner />
		</GridItem>
	)
}
