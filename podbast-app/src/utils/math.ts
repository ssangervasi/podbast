/**
 * Is `value` within `window` of `target`.
 */
export const isAround = (
	value: number,
	window: number,
	target: number,
): boolean => target - window <= value && value <= target + window
