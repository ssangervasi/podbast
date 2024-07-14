import { Draft, produce } from 'immer'
import type { PersistedState } from 'redux-persist'
import { createTransform, PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { isItemFresh } from '/src/features/subscriptions/models'
import { entries, log, values } from '/src/utils'

import { type RootReducerKey, type RootReducerReturn } from './reducers'

const logger = log.with({ prefix: 'Persist migrate' })

export const persistanceMigrate = async (
	state: PersistedState,
	_currentVersion: number,
): Promise<PersistedState> => {
	return produce(
		state as PersistedState & Partial<RootReducerReturn>,
		draft => {
			migrateRssCleanup(draft)
			migrateLayoutDefaults(draft)
			migrateSubscriptionActivity(draft)
			migrateSubscriptionItemCleanup(draft)
		},
	)
}

type Migrator = (draft: Draft<Partial<RootReducerReturn>>) => void

const migrateRssCleanup: Migrator = draft => {
	if ('rss' in draft) {
		logger.debug('Removing stored RSS state')
		delete draft['rss']
	}
}

const migrateLayoutDefaults: Migrator = draft => {
	if (draft.layout && !draft.layout.data) {
		draft.layout.data = {}
	}
}

const migrateSubscriptionActivity: Migrator = draft => {
	values(draft.subscriptions?.feedUrlToSubscription ?? {}).forEach(
		subscription => {
			if (!subscription.activity) {
				subscription.activity = {}
			}

			// Clear out catalogueIsoDate to stop storing old data.
			if (subscription.activity.catalogueIsoDate) {
				subscription.activity.catalogueIsoDate = undefined
			}
		},
	)
}

const migrateSubscriptionItemCleanup: Migrator = draft => {
	let delLen = 0

	values(draft.subscriptions?.feedUrlToItemIdToItem ?? {}).forEach(
		itemIdToItem => {
			entries(itemIdToItem).forEach(([_k, v]) => {
				if ('content' in v) {
					const content = v['content']
					if (typeof content === 'string') {
						delLen += content.length
						delete v['content']
					}
				}
			})
		},
	)

	if (delLen > 0) {
		logger.debug(`Deleted ${delLen} characters of sub content`)
	}
}

const transformDiscardItems = createTransform<
	RootReducerReturn['subscriptions'],
	RootReducerReturn['subscriptions']
>(
	(subState, key) => {
		if (key !== 'subscriptions') {
			logger.error('WTF transform key', key)
			return subState
		}

		return produce(subState, draft => {
			const deleted: string[] = []

			values(draft.feedUrlToItemIdToItem).forEach(itemIdToItem => {
				entries(itemIdToItem).forEach(([id, item]) => {
					if (isItemFresh(item)) {
						return
					}

					deleted.push(id)
					delete itemIdToItem[id]
				})
			})

			logger.debug(`Deleted ${deleted.length} inactive items`, deleted)
		})
	},
	null,
	{ whitelist: ['subscriptions'] },
)

// Persistence
export const persistConfig: PersistConfig<RootReducerReturn> = {
	key: 'root',
	storage,
	debug: true,
	throttle: 1_000,
	whitelist: ['layout', 'player', 'subscriptions'] satisfies RootReducerKey[],
	migrate: persistanceMigrate,
	transforms: [transformDiscardItems],
	writeFailHandler: err => {
		logger.error('Error writing localStorage', err)
	},
}
