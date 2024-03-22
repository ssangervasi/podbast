import { Heading, SimpleGrid, Text } from '@chakra-ui/react'

import { useAppSelector } from '/src/store'
import { Stack } from '/src/ui'

import { selectSubSummaries } from './slice'

export const SubscriptionsPage = () => {
	const summaries = useAppSelector(selectSubSummaries)

	return (
		<>
			<Stack w="full">
				<Heading size="md">Recent episodes</Heading>

				<SimpleGrid columns={12} spacing={2} w="full">
					{summaries.map(summary => (
						<Text key={summary.link}>{summary.title}</Text>
					))}
				</SimpleGrid>
			</Stack>
		</>
	)
}
