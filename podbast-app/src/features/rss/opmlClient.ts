import { log } from '/src/utils'

import { OpmlResponseGuard, Outline } from './models'

export const postOpml = async (opmlForm: FormData): Promise<Outline> => {
	try {
		if (!opmlForm.has('content')) {
			throw new Error('Form has no "content" field')
		}

		const apiUrl = new URL('/api/opml', window.location.origin)

		const res = await fetch(apiUrl, {
			method: 'post',
			body: opmlForm,
		})
		if (400 <= res.status) {
			throw new Error(`Request failed. Status: ${res.status}`)
		}

		const json = await res.json()
		if (OpmlResponseGuard.satisfied(json)) {
			return json.content
		}

		throw new Error('Invalid feed JSON')
	} catch (e) {
		log.error('postOpml Error', e)
		throw new Error('postOpml Error', { cause: e })
	}
}
