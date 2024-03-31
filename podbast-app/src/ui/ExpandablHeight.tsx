import { Box, BoxProps, IconButton, useDisclosure } from '@chakra-ui/react'
import { ChevronDownIcon } from '@vidstack/react/icons'

type Props = Omit<BoxProps, 'height'>

export const ExpandableHeight = (props: Props) => {
	const { minHeight, maxHeight, children } = props
	const { isOpen, onToggle } = useDisclosure()

	return (
		<Box>
			<Box
				minHeight={minHeight}
				maxHeight={isOpen ? maxHeight : minHeight}
				{...props}
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
