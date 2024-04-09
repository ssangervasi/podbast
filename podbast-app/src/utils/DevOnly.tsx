import { PropsWithChildren } from 'preact/compat'

import { isDev } from '/src/utils/isDev'

export const DevOnly = ({ children }: PropsWithChildren) => {
	if (!isDev()) {
		return null
	}
	return <>{children}</>
}
