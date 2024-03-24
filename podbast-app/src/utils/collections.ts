import { produce } from 'immer'

export const EMPTY_ARRAY: never[] = produce([], () => [])

export type Nullish<I = unknown> = I | null | undefined
export type Emptyish<I = unknown> = I[] | null | undefined

const _wrapEmpty = <I>(a: Emptyish<I>): I[] =>
	a !== undefined && a !== null && a.length > 0 ? a : EMPTY_ARRAY

export const wrapEmpty = Object.assign(_wrapEmpty, {
	EMPTY_ARRAY,
})

// export const EMPTY_RECORD: Record<string, any> = produce({}, () => ({}));
// export const emptyRecord = <R extends >(a: I[] | null | undefined): I[] =>
//   a !== undefined && a !== null && a.length > 0 ? a : EMPTY_ARRAY;

export const compact = <I>(a: Emptyish<Nullish<I>>): I[] =>
	wrapEmpty(wrapEmpty(a).filter((i): i is I => i !== null && i !== undefined))

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

export const values = <T>(ind: Indexed<T>): T[] => compact(Object.values(ind))
export const entries = <T>(ind: Indexed<T>): Array<[string, T]> =>
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
