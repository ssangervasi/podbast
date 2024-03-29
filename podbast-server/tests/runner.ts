import { tap, spec } from 'node:test/reporters'
import { fdir } from 'fdir'
import { run } from 'node:test'
import process from 'node:process'

const paths = await new fdir()
	.glob('**/*.test.ts')
	.withBasePath()
	.crawl('.')
	.withPromise()

console.log('files', paths)

run({
	files: paths,
})
	.on('test:fail', () => {
		process.exitCode = 1
	})
	.compose(spec as any)
	.pipe(process.stdout)
