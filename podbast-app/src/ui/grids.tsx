import { SimpleGrid } from '@chakra-ui/react'

import { withDefaults } from './vibes'

export const PageGrid = withDefaults(SimpleGrid, {
	columns: 12,
	spacing: 2,
	w: 'full',
})

// import
// export const PageGrid = () => (
// 	<SimpleGrid columns={12} spacing={2} w="full">
// 		{children}
// 	</SimpleGrid>
// )
