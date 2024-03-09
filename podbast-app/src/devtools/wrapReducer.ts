import { Action, Reducer } from 'redux'

import { log } from '/src/utils'

import { TEST_reset } from './cypressImportable'

export const wrapTestableReducer = <S, A extends Action>(
	baseReducer: Reducer<S, A>,
): Reducer<S, A> => {
	if (!import.meta.env.DEV) {
		return baseReducer
	}

	return (state: any, action: any) => {
		if (action.type === TEST_reset.type) {
			log('debug', 'testTools', 'reducer resetting state')
			return baseReducer(action.payload, action)
		}

		return baseReducer(state, action)
	}
}
