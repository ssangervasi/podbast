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

import { wrapTestableReducer } from '/src/devtools/wrapReducer'

import { rootReducer } from './reducers'

// Immer plugin
enableMapSet()

// Persistence
const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
	key: 'root',
	storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
const testableReducer = wrapTestableReducer(persistedReducer)
const reducer = testableReducer

// Actual store
export const store = configureStore({
	reducer,
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

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
