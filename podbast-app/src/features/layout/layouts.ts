import { ImpExpPage } from '/src/features/impexp/ImpExpPage'
import { QueuePage } from '/src/features/player/queue'
import { AddFeedPage } from '/src/features/rss'
import { LatestPage, SubscriptionsPage } from '/src/features/subscriptions'

export type Layout = {
	main: () => JSX.Element | null
	sideTitle: string
	sideTiny: string
	devOnly?: boolean
}

export const LAYOUTS = {
	subscriptions: {
		main: SubscriptionsPage,
		sideTitle: 'Subscriptions',
		sideTiny: 'Subs',
	},
	latest: {
		main: LatestPage,
		sideTitle: 'Latest episodes',
		sideTiny: 'Eps',
	},
	rss: {
		main: AddFeedPage,
		sideTitle: 'Add feed',
		sideTiny: 'Add',
	},
	impexp: {
		main: ImpExpPage,
		sideTitle: 'Import/Export',
		sideTiny: 'I/E',
	},
	queue: {
		main: QueuePage,
		sideTitle: 'Queue',
		sideTiny: 'Q',
		devOnly: true,
	},
} satisfies {
	[k: string]: Layout
}

export type LayoutName = keyof typeof LAYOUTS

export const LAYOUT_NAMES = Object.keys(LAYOUTS) as LayoutName[]
export const LAYOUT_ENTRIES: Array<Layout & { layoutName: LayoutName }> =
	LAYOUT_NAMES.map(layoutName => {
		const layout = LAYOUTS[layoutName]
		return {
			layoutName,
			...layout,
		}
	})
