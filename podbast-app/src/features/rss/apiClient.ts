import { buildRelativeUrl, log } from '/src/utils'

const logger = log.with({ prefix: 'apiClient' })

export const ROUTE_MAP = {
	opml: '/api/opml',
	rss: '/api/rss',
}

export type RouteMap = typeof ROUTE_MAP
export type RouteName = keyof RouteMap
export type RoutePath = RouteMap[keyof RouteMap]

export type ApiFetchArgs = {
	route: RouteName
	params?: URLSearchParams | Record<string, string>
}

export type ApiFetchResult =
	| {
			status: 'error'
			response?: Response
			json?: undefined
	  }
	| {
			status: 'success'
			response: Response
			json: unknown
	  }

export const apiFetch = async (
	{ route, params }: ApiFetchArgs,
	init?: RequestInit,
): Promise<ApiFetchResult> => {
	try {
		const path = ROUTE_MAP[route]
		const url = buildRelativeUrl(path, params)

		const response = await fetch(url, init)
		if (400 <= response.status) {
			return {
				status: 'error',
				response,
			}
		}

		const json: unknown = await response.json()
		return {
			status: 'success',
			response,
			json,
		}
	} catch (e) {
		logger.error(route, e)
		return {
			status: 'error',
		}
	}
}
