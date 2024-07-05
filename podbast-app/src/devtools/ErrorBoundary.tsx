import { PropsWithChildren } from 'preact/compat'
import { useErrorBoundary } from 'preact/hooks'

import { log } from '/src/utils'

const logger = log.with({ prefix: 'ErrorBoundary', level: 'error' })

export const ErrorBoundary = ({ children }: PropsWithChildren) => {
	const [error, resetError] = useErrorBoundary(error => logger(error))

	if (!error) {
		return <>{children}</>
	}

	return (
		<div>
			<p>{error.message}</p>
			<button onClick={resetError}>Try again</button>
		</div>
	)
}
