import {
	Flex,
	FlexProps,
	HStack as CHStack,
	Stack as CStack,
	StackProps,
	VStack as CVStack,
} from '@chakra-ui/react'

import { withDefaults } from './vibes'

export const Stack = withDefaults<StackProps>(CStack, { alignItems: 'start' })
export const VStack = withDefaults<StackProps>(CVStack, { alignItems: 'start' })
export const HStack = withDefaults<StackProps>(CHStack, { alignItems: 'start' })

export const HCenter = withDefaults<FlexProps>(Flex, {
	justifyContent: 'center',
	width: 'full',
})

export const VCenter = withDefaults<FlexProps>(Flex, {
	direction: 'column',
	alignItems: 'center',
	height: 'full',
})

export const PageStack = withDefaults<StackProps>(CVStack, {
	alignItems: 'start',
	maxWidth: {
		base: 'full',
		xl: 'container.lg',
	},
})
