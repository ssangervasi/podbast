import { Heading, Text } from '@chakra-ui/react'

import { selectMedia } from '/src/features/player/slice'
import { useAppSelector } from '/src/store'
import { PageStack } from '/src/ui'

export const QueuePage = () => {
	useAppSelector(selectMedia)

	return (
		<PageStack>
			<Heading as="h1">Queueueueueuueueueeeu</Heading>
			<Text>Queueueueueuueueueeeu</Text>
		</PageStack>
	)
}
