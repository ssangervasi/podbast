export const isDev = () => {
	if (!import.meta.env.DEV) {
		return false
	}
	if (typeof window === 'object' && 'Cypress' in window) {
		return false
	}
	return true
}
