import { tap, spec } from 'node:test/reporters'
import { fdir } from 'fdir'
import { run } from 'node:test'
import process from 'node:process'

const parseArgOptions = () => {
	const watch = process.argv.includes('--watch')
	return { watch }
}

const main = async () => {
	const paths = await new fdir()
		.glob('**/*.test.ts')
		.withBasePath()
		.crawl('.')
		.withPromise()

	console.log(`Found ${paths.length} paths`)

	const options = parseArgOptions()

	run({
		files: paths,
		watch: options.watch,
	})
		.on('test:fail', () => {
			process.exitCode = 1
		})
		.compose(spec as any)
		.pipe(process.stdout)
}

main()
