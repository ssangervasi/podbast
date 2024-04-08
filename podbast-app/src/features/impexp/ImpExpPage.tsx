import { DownloadIcon } from '@chakra-ui/icons'
import { Box, Button, Link } from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'preact/hooks'

import { selectExportableSubscriptions } from '/src/features/subscriptions'
import { useAppDispatch, useAppSelector } from '/src/store'
import { PageStack } from '/src/ui'

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

	// const export = useAppDispatch()

	// const [expDataUrl, setExpDataUrl] = useState<string>()

	return (
		<PageStack>
			{expDataUrl ? (
				<Link href={expDataUrl} download="podbast.json">
					<DownloadIcon boxSize={40} />
				</Link>
			) : null}

			<Box as="pre">{JSON.stringify(expData, null, 2)}</Box>
		</PageStack>
	)
}
