import { GridItem, Heading, SimpleGrid, Text } from '@chakra-ui/react'

import { useAppSelector } from '/src/store'
import { Stack } from '/src/ui'

import { selectSubSummaries } from './slice'

export const SubscriptionsPage = () => {
	const summaries = useAppSelector(selectSubSummaries)

	return (
		<>
			<Stack w="full">
				<Heading as="h1" size="lg">
					Podcast subscriptions
				</Heading>

				{
					true || summaries.length === 0 ? (
						<Text>Looks like you haven't subscribed to any podcast feeds yet. Go add an RSS feed!</Text>
					):null
				}

				<SimpleGrid columns={12} spacing={2} w="full">
					{summaries.map(summary => (
						<SummaryView summary={summary} key={summary.link} />
					))}
				</SimpleGrid>
			</Stack>
		</>
	)
}

export const SummaryView = ({
	summary,
}: {
	summary: {
		title: string
		link: string
	}
}) => {
	return (
		<>
			<GridItem colSpan={4}>
				<Text>{summary.title}</Text>
			</GridItem>
			<GridItem colSpan={8}>
				<Text>{summary.link}</Text>
			</GridItem>
		</>
	)
}
