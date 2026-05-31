import process from 'node:process'
import { App } from '@tinyhttp/app'

import { Storage } from '/src/storage.js'

export const PORT = Number(process.env.PORT) || 42993

const storage = new Storage()
const app = new App()

app.listen(PORT)

console.debug('Listening on', PORT)
