import throttle from 'lodash.throttle'

export const createThrottler = (ms: number) =>
	throttle((f: () => void) => {
		f()
	}, ms)
