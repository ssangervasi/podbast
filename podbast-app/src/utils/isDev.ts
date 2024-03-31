export const isDev = () => {
	if (!import.meta.env.DEV) {
		return false
	}
	if (isTest()) {
		return false
	}
	return true
}

export const isTest = () => {
	if (typeof window === 'object' && 'Cypress' in window) {
		return true
	}
	return false
}
