import {
	Flex,
	FlexProps,
	HStack as CHStack,
	Stack as CStack,
	StackProps,
	VStack as CVStack,
} from '@chakra-ui/react'
import { ComponentType } from 'preact'

function withDefaults<P>(Component: ComponentType<P>, defaults: Partial<P>) {
	return (props: P) => <Component {...defaults} {...props} />
}

export const Stack = withDefaults<StackProps>(CStack, { alignItems: 'start' })
export const VStack = withDefaults<StackProps>(CVStack, { alignItems: 'start' })
export const HStack = withDefaults<StackProps>(CHStack, { alignItems: 'start' })

export const VCenter = withDefaults<FlexProps>(Flex, { alignItems: 'center' })
