import { Rss } from '/src/features/rss'
import { Page as SubscriptionsPage } from '/src/features/subscriptions'

import { useLayout } from './useLayout'

export const Main = () => {
	const { layout } = useLayout()

	return (
		//
		<>
			{layout === 'rss' ? <Rss /> : null}
			{layout === 'subscriptions' ? <SubscriptionsPage /> : null}
		</>
	)
}
