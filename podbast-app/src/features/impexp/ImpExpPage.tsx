import { DownloadIcon } from '@chakra-ui/icons'
import {
	Alert,
	AlertIcon,
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
import { HStack, PageStack, TinyForm } from '/src/ui'
import { CodeBlock } from '/src/ui/CodeBlock'
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
		const fileSafeDate = getNow().toFormat('yyyy-MM-dd')
		return `${fileSafeDate}.podbast.json`
	}, [expSubs])

	return (
		<PageStack>
			<Heading as="h1">Export your podbast data</Heading>
			<Text>
				Save your data from this browser as a backup or to import it in another
				browser. Includes your subscriptions and play history.
			</Text>
			<Link
				href={expDataUrl}
				download={expFilename}
				aria-labelledby="text-download"
			>
				<HStack placeItems="center">
					<DownloadIcon boxSize={8} />
					<Text fontSize="larger" id="text-download">
						Download <Text as="i">{expFilename}</Text>
					</Text>
				</HStack>
			</Link>

			<DevOnly>
				<CodeBlock>{expData}</CodeBlock>
			</DevOnly>

			<Heading>Import your podbast data</Heading>
			<Text>Restore your data from a file.</Text>
			<ImpForm />
		</PageStack>
	)
}

type ImpResult =
	| {
			status: 'success'
			json: Exportable
	  }
	| {
			status: 'error'
			reason: string
			json?: unknown
	  }

const ImpForm = () => {
	const dispatch = useDispatch()

	const [result, setResult] = useState<ImpResult>()

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
		let json: unknown
		try {
			json = JSON.parse(text)
		} catch {
			setResult({
				status: 'error',
				reason: 'File is not valid JSON',
			})
			return
		}

		if (!ExportableGuard.satisfied(json)) {
			setResult({
				status: 'error',
				reason: 'File invalid (does match export format)',
				json,
			})
			return
		}

		setResult({
			status: 'success',
			json,
		})
		dispatch(receiveImport(json))
	}, [])

	return (
		<>
			<form name="importPodbastJson" onSubmit={handleSubmit}>
				<TinyForm>
					<FormControl maxWidth="200px">
						<FormLabel>podbast.json file</FormLabel>
						<Input
							type="file"
							name="content"
							padding={1}
							isRequired
							accept=".json"
							onChange={() => {
								setResult(undefined)
							}}
						></Input>
					</FormControl>
					<Button type="submit">Upload</Button>
				</TinyForm>
			</form>

			<ImpSummary result={result} />
		</>
	)
}

const ImpSummary = ({ result }: { result: ImpResult | undefined }) => {
	return (
		<>
			{result?.status === 'error' ? (
				<Alert status="error">
					<AlertIcon />
					{result.reason}
				</Alert>
			) : null}
			{result?.status === 'success' ? (
				<Alert status="success">
					<AlertIcon />
					Importing {result.json.subscriptions.length} subscriptions
				</Alert>
			) : null}
			<DevOnly>{result ? <CodeBlock>{result}</CodeBlock> : null}</DevOnly>
		</>
	)
}
