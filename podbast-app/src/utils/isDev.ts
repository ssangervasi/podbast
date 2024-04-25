export const isDev = () => {
	if (isWindowDev()) {
		return true
	}
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

const PODBAST_DEV = 'PODBAST_DEV'

export const isWindowDev = () => {
	if (typeof window !== 'object') {
		return false
	}

	if (PODBAST_DEV in window) {
		return true
	}

	const params = new URLSearchParams(window.location.search)
	if (params.has(PODBAST_DEV)) {
		return true
	}

	return false
}
