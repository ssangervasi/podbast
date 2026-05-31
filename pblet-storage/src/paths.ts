import * as path from 'node:path'
export { join } from 'node:path'

export const PBLET_ROOT = process.env.PBLET_ROOT

if (!PBLET_ROOT) {
	throw Error('Set PBLET_ROOT to target directory')
}

export const STORAGE_DIR = path.join(PBLET_ROOT, 'pblet-storage')
