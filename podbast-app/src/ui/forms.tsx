import { HStack } from './stacks'
import { withDefaults } from './vibes'

export const TinyForm = withDefaults(HStack, {
	alignItems: 'end',
	minWidth: '50%',
	maxWidth: '80%',
})
