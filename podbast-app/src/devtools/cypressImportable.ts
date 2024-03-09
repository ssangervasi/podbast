import type { AppStore, RootState } from '/src/store/store'
export { type RootState } from '/src/store/store'

declare global {
	namespace TEST {
		const store: AppStore
	}
}

const createTestAction = <
	ActionPayload = void,
	ActionType extends `TEST/${string}` = `TEST/${string}`,
>(
	actionType: ActionType,
) => {
	const actionCreator = function (payload: ActionPayload) {
		return {
			type: actionType,
			payload,
		}
	}
	actionCreator.type = actionType
	return actionCreator
}

export const TEST_reset = createTestAction<Partial<RootState>>('TEST/reset')
