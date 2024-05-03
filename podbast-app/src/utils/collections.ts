/* eslint-disable @typescript-eslint/array-type */
import { freeze } from 'immer'

export const EMPTY_ARRAY: ReadonlyArray<never> = freeze([])

export type Nullish<I = unknown> = I | null | undefined
export type Emptyish<I = unknown> = I[] | null | undefined

const _wrapEmpty = <I>(a: Emptyish<I>): ReadonlyArray<I> =>
	a !== undefined && a !== null && a.length > 0 ? a : EMPTY_ARRAY

export const wrapEmpty = Object.assign(_wrapEmpty, {
	EMPTY_ARRAY,
})

// export const EMPTY_RECORD: Record<string, any> = produce({}, () => ({}));
// export const emptyRecord = <R extends >(a: ReadonlyArray<I> | null | undefined): ReadonlyArray<I> =>
//   a !== undefined && a !== null && a.length > 0 ? a : EMPTY_ARRAY;

export const compact = <I>(a: Emptyish<Nullish<I>>): ReadonlyArray<I> =>
	wrapEmpty(
		//
		wrapEmpty(a).filter((i): i is I => i !== null && i !== undefined),
	)

export const sorted = <I>(
	a: ReadonlyArray<I>,
	compareFn?: (il: I, ir: I) => number,
) => {
	const ac = [...a]
	ac.sort(compareFn)
	return wrapEmpty(ac)
}

export const mapToMap = <IIn, KOut, IOut>(
	items: IIn[],
	mapper: (i: IIn) => Nullish<[KOut, IOut]>,
) => new Map(compact(items.map(mapper)))

export type Indexed<T> = { [key: string]: T | undefined }

export const mapToIndexed = <IIn, IOut>(
	items: IIn[],
	mapper: (item: IIn) => Nullish<[string, IOut]>,
) => {
	const indexed: Indexed<IOut> = {}
	compact(items.map(mapper)).forEach(([k, i]) => {
		indexed[k] = i
	})
	return indexed
}

export const indexedToRecord = <T>(ind: Indexed<T>): Record<string, T> => {
	const record: Record<string, T> = {}
	entries(ind).forEach(([k, i]) => {
		record[k] = i
	})
	return record
}

export const values = <T>(ind: Indexed<T>): ReadonlyArray<T> =>
	compact(Object.values(ind))
export const entries = <T>(ind: Indexed<T>): ReadonlyArray<[string, T]> =>
	compact(Object.entries(ind).map(([k, v]) => (v ? [k, v] : undefined)))

export const mapValues = <
	InObj extends object,
	OutV,
	K extends keyof InObj,
	V extends InObj[K],
	OutObj extends { [k in K]: OutV },
>(
	inObj: InObj,
	mapFn: (v: V, k: K) => OutV,
): OutObj =>
	Object.fromEntries(
		Object.entries(inObj).map(([k, v]) => [k, mapFn(v, k as K)]),
	) as OutObj
