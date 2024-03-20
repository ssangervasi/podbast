import {
	Box,
	IconButton,
	Text,
	TextProps,
	useDisclosure,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@vidstack/react/icons'

export const ExpandableLines = (props: TextProps) => {
	const { noOfLines: noOfLinesCollapsed, children } = props
	const { isOpen, onToggle } = useDisclosure()

	return (
		<Box>
			<Text noOfLines={isOpen ? undefined : noOfLinesCollapsed}>
				{children}
			</Text>
			<IconButton
				aria-label="Expand text"
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
