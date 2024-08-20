import { Text } from '@chakra-ui/react'

import { selectMedia } from '/src/features/player/slice'
import { useAppSelector } from '/src/store'
import { HStack } from '/src/ui'

export const MediaInfo = () => {
	const media = useAppSelector(selectMedia)

	return (
		<HStack w="full" px={4} py={2}>
			<Text>{media?.title}</Text>
		</HStack>
	)
}
