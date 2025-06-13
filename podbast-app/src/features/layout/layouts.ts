import { ImpExpPage } from '/src/features/impexp/ImpExpPage'
import { AddFeedPage } from '/src/features/rss'
import { LatestPage, SubscriptionsPage } from '/src/features/subscriptions'
import { SubscriptionDetailsPage } from '/src/features/subscriptions/SubscriptionDetailsPage'

import { QueuePage } from '../queue'

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
	subscriptionDetails: {
		main: SubscriptionDetailsPage,
		sideTitle: '-Subscription Details',
		sideTiny: '-Deets',
	},
	latest: {
		main: LatestPage,
		sideTitle: 'Latest episodes',
		sideTiny: 'Eps',
	},
	queue: {
		main: QueuePage,
		sideTitle: 'Queue',
		sideTiny: 'Q',
		// devOnly: true,
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
} satisfies {
	[k: string]: Layout
}

export type Layouts = typeof LAYOUTS
export type LayoutName = keyof Layouts

export type LayoutNameToData = {
	subscriptionDetails: {
		feedUrl: string
	}
}

export type LayoutNamesWithData = keyof LayoutNameToData
export type LayoutNamesWithoutData = Exclude<LayoutName, LayoutNamesWithData>
export type AnyLayoutData = LayoutNameToData[keyof LayoutNameToData]
export type PickLayoutData<Name extends LayoutName> =
	Name extends keyof LayoutNameToData ? LayoutNameToData[Name] : never

export const LAYOUT_NAMES = Object.keys(LAYOUTS) as LayoutName[]

export type LayoutEntry = Layout & { layoutName: LayoutName }

export const LAYOUT_ENTRIES: LayoutEntry[] = LAYOUT_NAMES.map(layoutName => {
	const layout = LAYOUTS[layoutName]
	return {
		layoutName,
		...layout,
	}
})
