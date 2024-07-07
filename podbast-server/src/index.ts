import process from 'node:process'
import { App } from '@tinyhttp/app'
import { narrow } from 'narrow-minded'
import serveStatic from 'serve-static'

import { app as rssApp } from './rss.js'
import { app as opmlApp } from './opmls.js'
import { PATHS } from './paths.js'

export const PORT = Number(process.env.PORT) || 42993

const app = new App()

app.use((req, res, next) =>
	//
	serveStatic(PATHS.PUBLIC)(req, res, () => next && next()),
)

app.get('/', (req, res) => {
	res.sendFile(PATHS.INDEX)
})

const apiApp = new App()

apiApp.use(rssApp)
apiApp.use(opmlApp)

apiApp.get('/debug', async (req, res) => {
	console.log('/debug requested ')
	if (process.env.NODE_ENV !== 'development') {
		console.log('/debug not dev env ')

		return res.sendStatus(404)
	}

	if (!narrow({ url: 'string' }, req.query)) {
		console.log('/debug invalid query ')

		return res.sendStatus(400)
	}

	const { url } = req.query

	if (url.includes('/api/debug')) {
		return res.status(403).send('Nice try')
	}

	const fres = await fetch(url, {
		method: 'GET',
		headers: {},
	})

	console.log('/debug fetched', { status: fres.status })

	// url
	res.send(await fres.text())
})

app.use('/api', apiApp)

app.listen(PORT)

console.debug('Listening on', PORT)
