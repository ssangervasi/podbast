import { fileURLToPath } from 'node:url'
import * as path from 'node:path'

export { join } from 'node:path'

const dirname = path.join(fileURLToPath(import.meta.url), '..')

export const ROOT = path.join(dirname, '..')
export const PUBLIC = path.join(ROOT, 'public')
export const INDEX = path.join(PUBLIC, 'index.html')

export const PATHS = {
	ROOT,
	PUBLIC,
	INDEX,
}
