// import { produce } from 'immer'
// import type { PersistedState, PersistMigrate } from 'redux-persist'

// import type { RootReducerReturn } from './reducers'

// export const persistanceMigrate = async (
// 	state: PersistedState,
// 	_currentVersion: number,
// ): Promise<PersistedState> => {
// 	return produce(
// 		state as PersistedState & Partial<RootReducerReturn>,
// 		draft => {
//       // if
//     },
// 	)
// }

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
// 	{},
// )
