import { produce } from 'immer'

export const EMPTY_ARRAY: never[] = produce([], () => [])

export type Emptyish<I = unknown> = I[] | null | undefined

const _wrapEmpty = <I>(a: Emptyish<I>): I[] =>
	a !== undefined && a !== null && a.length > 0 ? a : EMPTY_ARRAY

export const wrapEmpty = Object.assign(_wrapEmpty, {
	EMPTY_ARRAY,
})

// export const EMPTY_RECORD: Record<string, any> = produce({}, () => ({}));
// export const emptyRecord = <R extends >(a: I[] | null | undefined): I[] =>
//   a !== undefined && a !== null && a.length > 0 ? a : EMPTY_ARRAY;

export const compact = <I>(a: Emptyish<I>): I[] =>
	wrapEmpty(wrapEmpty(a).filter((i): i is I => i !== null && i !== undefined))
