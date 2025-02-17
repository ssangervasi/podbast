import { Button, HStack, Link, Text } from '@chakra-ui/react'

import { isDev } from '/src/utils'

import { useLayout } from './useLayout'

export const Top = () => {
	const { show } = useLayout()

	return (
		<HStack
			justify="space-between"
			bg={isDev() ? 'purple.400' : 'gray.700'}
			borderBottomWidth={2}
			borderBottomColor="black"
			paddingX={2}
			paddingY={0.5}
		>
			<Button variant="unstyled" onClick={() => show('subscriptions')}>
				<HStack as="header">
					<Text
						fontSize="3xl"
						fontWeight="bold"
						color="purple.100"
						children="🜪"
						// eslint-disable-next-line max-len
						title="This is the alchemical symbol for lead, which is Pb, like the abbreviation for 'Podbast'. Good one, right?"
					/>
					<Text fontSize="xl" fontWeight="bold">
						podbast
					</Text>
				</HStack>
			</Button>

			<HStack>
				{isDev() ? <Text>dev dev dev dev dev dev dev</Text> : null}
				<Link href="https://github.com/ssangervasi/podbast" isExternal>
					source
				</Link>
			</HStack>
		</HStack>
	)
}
