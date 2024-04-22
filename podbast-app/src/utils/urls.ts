import { Indexed, indexedToRecord, mapToIndexed } from '/src/utils'

export type SearchParamish = URLSearchParams | Indexed<string>

export type UrlParts = {
	url: string
	params: Indexed<string>
}

export type UrlIsh =
	| string
	| URL
	| {
			url: string | URL
			params: SearchParamish
	  }

export const buildUrl = (urlish: UrlIsh): URL => {
	if (urlish instanceof URL) {
		return urlish
	}

	if (typeof urlish === 'string') {
		return new URL(urlish)
	}

	const url = new URL(urlish.url)
	mergeUrlParams(url.searchParams, urlish.params)

	return url
}

export const mergeUrlParams = (
	target: URLSearchParams,
	source: SearchParamish,
) => {
	const other =
		source instanceof URLSearchParams
			? source
			: new URLSearchParams(indexedToRecord(source))
	for (const [key, value] of other.entries()) {
		target.append(key, value)
	}
	return target
}

export const buildRelativeUrl = (path: string, params: SearchParamish = {}) => {
	const url = new URL(path, window.location.origin)
	mergeUrlParams(url.searchParams, params)
	return url
}

export const buildUrlParts = (urlish: UrlIsh): UrlParts => {
	const url = buildUrl(urlish)
	return {
		url: `${url.origin}${url.pathname}`,
		params: mapToIndexed([...url.searchParams.entries()], e => e),
	}
}
