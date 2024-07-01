import { Button, chakra, useBreakpointValue } from '@chakra-ui/react'
import { ReactNode } from 'preact/compat'

import { isDev } from '/src/utils'

import { LAYOUT_ENTRIES, LayoutNamesWithoutData } from './layouts'
import { useLayout } from './useLayout'

const SIDE_LAYOUT_ENTRIES = LAYOUT_ENTRIES.filter(
	le => le.layoutName !== 'subscriptionDetails',
)

export const Side = () => {
	const needsTiny = useBreakpointValue([true, false])

	return (
		<chakra.nav paddingTop={2}>
			{SIDE_LAYOUT_ENTRIES.map(
				({ layoutName, sideTitle, sideTiny, devOnly }) =>
					devOnly && !isDev() ? null : (
						<SideButton to={layoutName as LayoutNamesWithoutData}>
							{needsTiny ? sideTiny : sideTitle}
						</SideButton>
					),
			)}
		</chakra.nav>
	)
}

const SideButton = ({
	to,
	children,
}: {
	to: LayoutNamesWithoutData
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
			data-nav={to}
			onClick={() => {
				show(to)
			}}
			leftIcon={<span>{layoutName === to ? '»' : ' '}</span>}
		>
			{children}
		</Button>
	)
}
