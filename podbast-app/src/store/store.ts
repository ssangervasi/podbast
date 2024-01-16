import { configureStore } from '@reduxjs/toolkit'
import { enableMapSet } from 'immer'
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PersistConfig,
	persistReducer,
	persistStore,
	PURGE,
	REGISTER,
	REHYDRATE,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { rootReducer } from './reducers'

// Immer plugin
enableMapSet()

// Persistence
const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
	key: 'root',
	storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Actual store
export const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
})

export const persistor = persistStore(store)

/**
 * ~~Maybe this will save me having to clear the state?
 * https://github.com/rt2zz/redux-persist/blob/master/docs/hot-module-replacement.md
 * ~~
 * Nah, would have to figure out migrations:
 * https://github.com/rt2zz/redux-persist/blob/master/docs/migrations.md
 */
// if (import.meta.hot) {
//   import.meta.hot.accept("./reducers", () => {
//     import("./reducers").then((r) => {
//       store.replaceReducer(persistReducer(persistConfig, r.rootReducer));
//     });
//   });
// }

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
