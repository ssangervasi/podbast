import { chakra } from '@chakra-ui/react'

import { isoToShortDate, secondsToTimeString } from '/src/utils/datetime'

export const TimeView = ({ seconds }: { seconds: number }) => (
	<chakra.span fontFamily="monospace" fontSize="x-small">
		{secondsToTimeString(seconds)}
	</chakra.span>
)

export const DateView = ({ isoDate }: { isoDate: string }) => (
	<chakra.span fontFamily="monospace" fontSize="x-small">
		{isoToShortDate(isoDate)}
	</chakra.span>
)
