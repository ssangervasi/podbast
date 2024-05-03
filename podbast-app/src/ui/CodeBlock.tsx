import { Box } from '@chakra-ui/react'

import { ExpandableHeight } from './ExpandablHeight'

export const CodeBlock = ({
	raw = false,
	children,
}: {
	raw?: boolean
	children: unknown
}) => {
	return (
		<ExpandableHeight>
			<Box as="pre" maxWidth="80ch" overflowX="auto">
				{raw ? `${children}` : JSON.stringify(children, null, 2)}
			</Box>
		</ExpandableHeight>
	)
}
