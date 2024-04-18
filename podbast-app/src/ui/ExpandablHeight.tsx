import { Box, IconButton, StyleProps, useDisclosure } from '@chakra-ui/react'
import { ChevronDownIcon } from '@vidstack/react/icons'
import { PropsWithChildren } from 'preact/compat'

type Props = PropsWithChildren<Omit<StyleProps, 'height'>>

export const ExpandableHeight = (props: Props) => {
	const {
		minHeight = '3rem',
		maxHeight = '100%',
		overflowY = 'hidden',
		children,
		...rest
	} = props
	const { isOpen, onToggle } = useDisclosure()

	return (
		<Box maxWidth="full" maxHeight="full" overflow="hidden">
			<Box
				minHeight={minHeight}
				maxHeight={isOpen ? maxHeight : minHeight}
				overflowY={overflowY}
				{...rest}
			>
				{children}
			</Box>

			<IconButton
				aria-label="Expand"
				variant="interactOnly"
				width="full"
				height="18px"
				display="flex"
				alignItems="center"
				marginX={1}
				icon={
					<Box
						boxSize="18px"
						transform={isOpen ? 'rotate(180deg)' : ''}
						transitionProperty="transform"
						transitionDuration="0.25s"
					>
						<ChevronDownIcon />
					</Box>
				}
				onClick={onToggle}
			/>
		</Box>
	)
}
