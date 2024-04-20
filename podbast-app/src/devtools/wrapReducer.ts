import { Action, Reducer } from 'redux'

import { log } from '/src/utils'
import { isTest } from '/src/utils/isDev'

import { TEST_reset } from './cypressImportable'

export const wrapTestableReducer = <S, A extends Action>(
	baseReducer: Reducer<S, A>,
): Reducer<S, A> => {
	if (!isTest()) {
		return baseReducer
	}

	return (state: any, action: any) => {
		if (action.type === TEST_reset.type) {
			log.with({ prefix: 'testTools' }).debug('reducer resetting state')
			return baseReducer(action.payload, action)
		}

		return baseReducer(state, action)
	}
}
