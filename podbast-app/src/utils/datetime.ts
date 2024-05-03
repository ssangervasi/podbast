import { DateTime, Duration } from 'luxon'

export { DateTime, Duration } from 'luxon'

export const fromIso = (isoDate: string | DateTime): DateTime<true> => {
	return ensureValid(
		isoDate instanceof DateTime ? isoDate : DateTime.fromISO(isoDate),
	)
}

export const parseDate = (du: unknown): DateTime<true> => {
	let dt: DateTime | undefined

	if (typeof du === 'string') {
		dt = DateTime.fromJSDate(new Date(du))
	}
	if (typeof du === 'number') {
		dt = DateTime.fromMillis(du)
	}

	return ensureValid(dt)
}

const _cmpIsoDate = (a: string | DateTime, b: string | DateTime): number => {
	const da = fromIso(a)
	const db = fromIso(b)
	return da.toMillis() - db.toMillis()
}

export const cmpIsoDate = Object.assign(_cmpIsoDate, {
	desc: ((a, b) => -_cmpIsoDate(a, b)) satisfies typeof _cmpIsoDate,
})

export const isoToShortDate = (isoDate: string) =>
	fromIso(isoDate).toLocaleString(DateTime.DATE_SHORT)

export const ensureValid = (dt: DateTime | undefined): DateTime<true> => {
	if (dt && dt.isValid) {
		return dt
	}
	// I'm sure I'll regret using epoch at some point
	return getEpoch()
}

export const getEpoch = (): DateTime<true> => {
	return DateTime.fromMillis(0) as DateTime<true>
}

export const getNow = (): DateTime<true> => {
	return DateTime.now()
}

export const parseDurationString = (ds: string): Duration => {
	const nums = ds
		.split(':')
		.map(part => Number.parseFloat(part.trim()))
		.filter(n => !Number.isNaN(n))

	if (nums.length === 0) {
		return Duration.invalid('No numerical parts')
	}

	if (nums.length === 1) {
		const [seconds] = nums
		return Duration.fromObject({ seconds })
	}
	if (nums.length === 2) {
		const [minutes, seconds] = nums
		return Duration.fromObject({ minutes, seconds })
	}
	if (nums.length === 3) {
		const [hours, minutes, seconds] = nums
		return Duration.fromObject({ hours, minutes, seconds })
	}

	return Duration.invalid(
		'Too many parts in duration (only hours:minutes:seconds allowed)',
	)
}

export const parseDurationToSeconds = (ds: unknown): number | undefined => {
	if (typeof ds === 'number') {
		return ds
	}

	if (typeof ds === 'string') {
		const dur = parseDurationString(ds)
		if (dur.isValid) {
			return dur.as('seconds')
		}
	}

	return undefined
}

export const durationFromSeconds = (time: number) =>
	Duration.fromObject({ seconds: time })

export const secondsToTimeString = (time: number) =>
	durationFromSeconds(time).toFormat('hh:mm:ss')
