import { DateTime } from 'luxon'

export { DateTime, Duration } from 'luxon'

export const fromIso = (isoDate: string): DateTime<true> => {
	return ensureValid(DateTime.fromISO(isoDate))
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
