import { Button, HStack, List, ListItem, Text } from '@chakra-ui/react'

import { play } from '/src/features/player'
import { Feed } from '/src/features/rss/guards'
import { useAppDispatch, useAppSelector } from '/src/store'
import { VStack } from '/src/ui'

export const FeedViewer = ({ feed }: { feed: Feed }) => {
	const dispatch = useAppDispatch()

	return (
		<VStack>
			<Text bold>{feed.title}</Text>

			<List spacing={2}>
				{feed.items.map(fi => (
					<ListItem>
						<HStack>
							<Button
								// height="sm"
								size="sm"
								onClick={() => {
									dispatch(
										play({
											title: fi.title,
											url: fi.enclosure.url,
										}),
									)
								}}
							>
								▶
							</Button>
							<Text as="i">{fi.title}</Text>
						</HStack>
					</ListItem>
				))}
			</List>
		</VStack>
	)
}
