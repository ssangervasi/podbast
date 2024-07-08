import { Button, HStack, Link, Text } from '@chakra-ui/react'

import { useLayout } from './useLayout'

export const Top = () => {
	const { show } = useLayout()

	return (
		<Button variant="unstyled" onClick={() => show('subscriptions')}>
			<HStack
				justify="space-between"
				bg="gray.700"
				borderBottomWidth={2}
				borderBottomColor="black"
				paddingX={2}
				paddingY={0.5}
			>
				<HStack as="header">
					<Text
						fontSize="3xl"
						fontWeight="bold"
						color="purple.100"
						children="🜪"
						title="This is the alchemical symbol for lead, which is Pb, like the abbreviation for 'Podbast'. Good one, right?"
					/>
					<Text fontSize="xl" fontWeight="bold">
						podbast
					</Text>
				</HStack>

				<HStack>
					<Link href="https://github.com/ssangervasi/podbast" isExternal>
						source
					</Link>
				</HStack>
			</HStack>
		</Button>
	)
}
