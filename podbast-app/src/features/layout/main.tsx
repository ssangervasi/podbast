import { Rss } from '/src/features/rss'
import { Subscriptions } from '/src/features/subscriptions'

import { useLayout } from './useLayout'

export const Main = () => {
	const { layout } = useLayout()

	return (
		//
		<>
			{layout === 'rss' ? <Rss /> : null}
			{layout === 'subscriptions' ? <Subscriptions /> : null}
		</>
	)
}
