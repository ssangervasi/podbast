import { Rss } from '/src/features/rss'
import { LatestPage, SubscriptionsPage } from '/src/features/subscriptions'

export const LAYOUTS = {
	subscriptions: {
		main: SubscriptionsPage,
		sideTitle: 'Subscriptions',
	},
	latest: {
		main: LatestPage,
		sideTitle: 'Latest episodes',
	},
	rss: {
		main: Rss,
		sideTitle: 'Add feed',
	},
} satisfies {
	[k: string]: {
		main: () => JSX.Element | null
		sideTitle: string
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
