import { Button, chakra, useBreakpointValue } from '@chakra-ui/react'
import { ReactNode } from 'preact/compat'

import { LAYOUT_ENTRIES, LayoutName } from './layouts'
import { useLayout } from './useLayout'

export const Side = () => {
	const needsTiny = useBreakpointValue([true, false])

	return (
		<chakra.nav paddingTop={2}>
			{LAYOUT_ENTRIES.map(({ layoutName, sideTitle, sideTiny }) => (
				<SideButton to={layoutName}>
					{needsTiny ? sideTiny : sideTitle}
				</SideButton>
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

	return (
		<Button
			variant="ghost"
			width="full"
			HeadingOverflow="ellipsis"
			justifyContent="flex-start"
			paddingX="1"
			onClick={() => {
				show(to)
			}}
			leftIcon={<span>{layoutName === to ? '»' : ' '}</span>}
		>
			{children}
		</Button>
	)
}
