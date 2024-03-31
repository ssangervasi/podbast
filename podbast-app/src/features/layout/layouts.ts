import { AddFeedPage } from '/src/features/rss'
import { LatestPage, SubscriptionsPage } from '/src/features/subscriptions'

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
} satisfies {
	[k: string]: {
		main: () => JSX.Element | null
		sideTitle: string
		sideTiny: string
	}
}

export type LayoutName = keyof typeof LAYOUTS

export const LAYOUT_NAMES = Object.keys(LAYOUTS) as LayoutName[]
export const LAYOUT_ENTRIES = LAYOUT_NAMES.map(layoutName => {
	const layout = LAYOUTS[layoutName]
	return {
		layoutName,
		...layout,
	}
})
