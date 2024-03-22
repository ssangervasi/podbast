import { Button, chakra, Text, useBreakpointValue } from '@chakra-ui/react'
import { ReactNode } from 'preact/compat'

import { LAYOUT_ENTRIES, LayoutName } from './layouts'
import { useLayout } from './useLayout'

export const Side = () => {
	return (
		<chakra.nav>
			<Text>Sidebar</Text>
			{LAYOUT_ENTRIES.map(({ layoutName, sideTitle }) => (
				<SideButton to={layoutName}>{sideTitle}</SideButton>
			))}
		</chakra.nav>
	)
}

const SideButton = ({
	to,
	children,
}: {
	to: LayoutName
	children: ReactNode
}) => {
	const { layoutName, show } = useLayout()
	const needsTiny = useBreakpointValue([true, false])

	return (
		<Button
			variant="ghost"
			width="full"
			textOverflow="ellipsis"
			justifyContent="flex-start"
			paddingX="1"
			onClick={() => {
				show(to)
			}}
			leftIcon={<span>{layoutName === to ? '»' : ' '}</span>}
		>
			{needsTiny ? to[0] : children}
		</Button>
	)
}
