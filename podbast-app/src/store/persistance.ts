import { produce } from 'immer'
import type { PersistedState } from 'redux-persist'
import { createTransform, PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { hasActivity } from '/src/features/subscriptions/models'
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
			if ('rss' in draft) {
				logger.info('Removing stored RSS state')
				delete draft['rss']
			}

			if (draft.layout && !draft.layout.data) {
				draft.layout.data = {}
			}

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
				logger.info(`Deleted ${delLen} characters of sub content`)
			}
		},
	)
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
					if (hasActivity(item)) {
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
