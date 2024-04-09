import { DownloadIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	chakra,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Link,
	Text,
} from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'preact/hooks'

import { selectExportableSubscriptions } from '/src/features/subscriptions'
import { useAppDispatch, useAppSelector } from '/src/store'
import { HStack, PageStack } from '/src/ui'
import { getNow, isoToShortDate } from '/src/utils/datetime'
import { DevOnly } from '/src/utils/DevOnly'

const encodeJsonDataUrl = (jsonData: any) => {
	const mimeType = 'text/json;charset=utf-8'
	const charset = 'charset=utf-8'
	const jsonStr = JSON.stringify(jsonData, null, 2)
	return `data:${mimeType};${charset},${encodeURIComponent(jsonStr)}`
}

export const ImpExpPage = () => {
	const expSubs = useAppSelector(selectExportableSubscriptions)

	const expData = useMemo(
		() => ({
			subscriptions: expSubs,
		}),
		[expSubs],
	)
	const expDataUrl = useMemo(() => encodeJsonDataUrl(expData), [expData])

	const expFilename = useMemo(() => {
		const filesafeDate = getNow().toFormat('yyyy-mm-dd')
		return `${filesafeDate}.podbast.json`
	}, [expSubs])

	// const export = useAppDispatch()

	// const [expDataUrl, setExpDataUrl] = useState<string>()

	return (
		<PageStack>
			<Heading as="h2">Export your podbast data</Heading>
			<Text>
				Save your data from this browser as a backup or to import it in another
				browser. Includes your subscriptions and play history.
			</Text>
			<HStack placeItems="center">
				<Link
					href={expDataUrl}
					download={expFilename}
					aria-labelledby="text-download"
				>
					<DownloadIcon boxSize={16} />
				</Link>
				<Text fontSize="large" id="text-download">
					Download <Text as="i">{expFilename}</Text>
				</Text>
			</HStack>

			<Heading as="h2">Import your podbast data</Heading>
			<Text>Restore your data from a file.</Text>
			<ImpForm />

			<DevOnly>
				<Box as="pre">{JSON.stringify(expData, null, 2)}</Box>
			</DevOnly>
		</PageStack>
	)
}

const ImpForm = () => {
	const handleSubmit = useCallback(() => {}, [])

	return (
		<>
			<form name="importFeedList" onSubmit={handleSubmit}>
				<HStack alignItems="end">
					<FormControl maxWidth="200px">
						<FormLabel>podbast.json file</FormLabel>
						<Input type="file" name="content" padding={1}></Input>
					</FormControl>
					<Button type="submit">Import</Button>
				</HStack>
			</form>
		</>
	)
}
