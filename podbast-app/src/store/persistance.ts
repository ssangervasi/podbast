import { produce } from 'immer'
import type { PersistedState } from 'redux-persist'
import { PersistConfig, type WebStorage } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

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
			// log.with({ prefix: 'Persist migrate' }).debug(Object.keys(draft))
			// if  "layout", "player", "subscriptions", "_persist" ]
			if ('rss' in draft) {
				logger.info('Removing stored RSS state')
				delete draft['rss']
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

class MyStorage implements WebStorage {
	log = logger.with({ prefix: 'MyStorage', level: 'debug' })

	async getItem(key: string) {
		this.log('getItem', { key })
		if (typeof window === 'object') {
			return window.localStorage.getItem(key)
		}

		return null
	}

	async removeItem(key: string) {
		this.log('removeItem', { key })
	}

	async setItem(key: string, value: string) {
		this.log('setItem', { key, value })
	}
}

const myStorage = new MyStorage()

// Persistence
export const persistConfig: PersistConfig<RootReducerReturn> = {
	key: 'root',
	storage,
	// storage: myStorage,
	debug: true,
	throttle: 1_000,
	whitelist: ['layout', 'player', 'subscriptions'] satisfies RootReducerKey[],
	migrate: persistanceMigrate,
	transforms: [
		{
			in: (s, k) => {
				logger.debug('transform', k)
				return s
			},
			out: (s, k) => s,
		},
	],
	writeFailHandler: err => {
		logger.error('Error writing localStorage', err)
	},
}

// Considering this instead of top-level white/blacklist

// import { createTransform } from 'redux-persist'
// export const PersistTransform = createTransform<
// 	RootReducerReturn['subscriptions'],
// 	'subscriptions',
// 	RootReducerReturn
// >(
// 	// Inbound
// 	() => {},
// 	// Outbound
// 	() => {},
// 	{
//     whitelist: []
//   },
// )
