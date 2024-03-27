import { Button, HStack, List, ListItem, Text } from '@chakra-ui/react'

import { VStack } from '/src/ui'
import { isDev } from '/src/utils/isDev'

const LOCAL_URLS_VAR = `${import.meta.env.VITE_LOCAL_RSS_FEEDS ?? ''}`

export const LOCAL_URLS = LOCAL_URLS_VAR.split(/\s+/).filter(
	u => u.length && URL.canParse(u),
)

export const LocalUrlForm = () => {
	if (!isDev()) {
		return null
	}

	return (
		<VStack>
			<Text as="b"> Previous URLS:</Text>
			<List spacing={2}>
				{LOCAL_URLS.map(u => (
					<ListItem key={u}>
						<HStack>
							<Button
								size="sm"
								onClick={() => {
									const inputEl: HTMLInputElement =
										document.querySelector('input[name=url]')!
									inputEl.value = u
								}}
							>
								Autofill
							</Button>

							<Text as="span" fontFamily="monospace" textOverflow="ellipsis">
								{u}
							</Text>
						</HStack>
					</ListItem>
				))}
			</List>
		</VStack>
	)
}
