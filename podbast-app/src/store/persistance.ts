import { produce } from 'immer'
import type { PersistedState } from 'redux-persist'

import { log } from '/src/utils'

import type { RootReducerReturn } from './reducers'

export const persistanceMigrate = async (
	state: PersistedState,
	_currentVersion: number,
): Promise<PersistedState> => {
	return produce(
		state as PersistedState & Partial<RootReducerReturn>,
		draft => {
			log.with({ prefix: 'Persist migrate' }).debug(Object.keys(draft))
		},
	)
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
