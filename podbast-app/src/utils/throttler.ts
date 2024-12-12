import throttle from 'lodash.throttle'

export const createThrottler = (
	ms: number,
	options: { trailing?: boolean } = { trailing: false },
) =>
	throttle(
		(f: () => void) => {
			f()
		},
		ms,
		options,
	)

export const stall = async (ms: number) =>
	new Promise<void>(resolve =>
		setTimeout(() => {
			resolve()
		}, ms),
	)

// export const stallUntil = async (fn: () => boolean, ms: number) => {
// 	const res = fn()
// 		if (res) {
// 			resolve()
// 		}
// 		await stall(ms)
// 	new Promise<void>(async resolve => {
// 		const res = fn()
// 		if (res) {
// 			resolve()
// 		}
// 		await stall(ms)
// 	})
// }
