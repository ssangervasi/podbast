import { DownloadIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Link,
	Text,
} from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'preact/hooks'
import { useDispatch } from 'react-redux'

import {
	receiveImport,
	selectExportableSubscriptions,
} from '/src/features/subscriptions'
import { Exportable, ExportableGuard } from '/src/features/subscriptions/models'
import { useAppSelector } from '/src/store'
import { HStack, PageStack } from '/src/ui'
import { ExpandableHeight } from '/src/ui/ExpandablHeight'
import { getNow } from '/src/utils/datetime'
import { DevOnly } from '/src/utils/DevOnly'

const encodeJsonDataUrl = (jsonData: any) => {
	const mimeType = 'text/json;charset=utf-8'
	const charset = 'charset=utf-8'
	const jsonStr = JSON.stringify(jsonData, null, 2)
	return `data:${mimeType};${charset},${encodeURIComponent(jsonStr)}`
}

export const ImpExpPage = () => {
	const expSubs = useAppSelector(selectExportableSubscriptions)

	const expData: Exportable = useMemo(
		() => ({
			subscriptions: expSubs,
		}),
		[expSubs],
	)
	const expDataUrl = useMemo(() => encodeJsonDataUrl(expData), [expData])

	const expFilename = useMemo(() => {
		const fileSafeDate = getNow().toFormat('yyyy-mm-dd')
		return `${fileSafeDate}.podbast.json`
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
				<ExpandableHeight>
					<Box as="pre" maxWidth="80ch" overflowX="auto">
						{JSON.stringify(expData, null, 2)}
					</Box>
				</ExpandableHeight>
			</DevOnly>
		</PageStack>
	)
}

const ImpForm = () => {
	const dispatch = useDispatch()

	const [res, setRes] = useState<string>()

	const handleSubmit = useCallback(async (evt: SubmitEvent) => {
		evt.preventDefault()
		if (!(evt.currentTarget instanceof HTMLFormElement)) {
			return
		}
		const fileEl = evt.currentTarget.elements.namedItem('content')
		if (!(fileEl instanceof HTMLInputElement)) {
			return
		}

		const file = fileEl.files?.[0]
		if (!file) {
			return
		}
		const text = await file.text()
		let json
		try {
			json = JSON.parse(text)
			setRes(text)
		} catch {
			setRes('invalid file')
			return
		}

		if (ExportableGuard.satisfied(json)) {
			dispatch(receiveImport(json))
		}
	}, [])

	return (
		<>
			<form name="importPodbastJson" onSubmit={handleSubmit}>
				<HStack alignItems="end">
					<FormControl maxWidth="200px">
						<FormLabel>podbast.json file</FormLabel>
						<Input
							type="file"
							name="content"
							padding={1}
							isRequired
							accept=".json"
						></Input>
					</FormControl>
					<Button type="submit">Import</Button>
				</HStack>
			</form>

			{res ? <pre>{res}</pre> : null}
		</>
	)
}
