import { Box, Button, Text, useBreakpointValue } from '@chakra-ui/react'
import { ReactNode } from 'preact/compat'

import { VStack } from '/src/ui'

import { LayoutName, useLayout } from './useLayout'

export const Side = () => {
	return (
		<>
			<Text>Sidebar</Text>
			<SideButton to="rss">Add feed</SideButton>
			<SideButton to="subscriptions">Subscriptions</SideButton>
		</>
	)
}

const SideButton = ({
	to,
	children,
}: {
	to: LayoutName
	children: ReactNode
}) => {
	const { layout, show } = useLayout()
	const needsTiny = useBreakpointValue([true, false])

	return (
		<Button
			variant="ghost"
			width="full"
			textOverflow="ellipsis"
			justifyContent="flex-start"
			paddingX="1"
			onClick={() => show(to)}
			leftIcon={<span>{layout === to ? '»' : ' '}</span>}
		>
			{needsTiny ? to[0] : children}
		</Button>
	)
}
