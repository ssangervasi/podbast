import { chakra, GridItem, SimpleGrid } from '@chakra-ui/react'
import { PropsWithChildren } from 'preact/compat'

import { withDefaults } from './vibes'

export const PageGrid = withDefaults(SimpleGrid, {
	columns: 12,
	spacing: 2,
	w: 'full',
})

export const EpisodesGrid = withDefaults(SimpleGrid, {
	columns: 12,
	spacing: 2,
	w: 'full',
	// First column designated for play button, which is meh.
	gridTemplateColumns: 'max-content repeat(11, minmax(0, 1fr))',
})

export const RowWrapper = ({ children, ...rest }: PropsWithChildren) => {
	return (
		<chakra.div display="contents" role="group" {...rest}>
			{children}

			<GridItem
				colSpan={12}
				sx={{
					height: '2px',
					borderRadius: 'md',
					transitionProperty: 'box-shadow',
					transitionDuration: '100ms',
					transitionTimingFunction: 'ease-in',
				}}
				_groupHover={{
					boxShadow: '0 -10px 5px rgb(30, 5, 5)',
				}}
			></GridItem>
		</chakra.div>
	)
}
