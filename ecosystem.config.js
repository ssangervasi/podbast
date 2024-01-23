/**
 * PM2 needs a patch:
 *
 * ```
 * // pm2/lib/Common.js#340
 * } else if (filename.indexOf(".config.mjs") > -1) {
 *    var confPath = Url.pathToFileURL(path.resolve(filename));
 *    return import(confPath);
 *  }
 * ```
 * See: https://github.com/Unitech/pm2/issues/4591
 *
 * @typedef {import('pm2').StartOptions} StartOptions
 * @type {{ apps: StartOptions[] }}
 */
module.exports = {
	apps: [
		{
			name: 'app-dev',
			cwd: './podbast-app',
			interpreter: 'bash',
			interpreter: 'bash',
			script: 'bin/runner.sh',
			args: 'dev',
			shutdown_with_message: true,
		},
		{
			name: 'server-dev',
			cwd: './podbast-server',
			interpreter: 'bash',
			script: 'bin/runner.sh',
			args: 'dev',
			shutdown_with_message: true,
		},
		{
			name: 'server',
			cwd: './podbast-server',
			script: 'dist/index.js',
			watch: 'dist/',
			env: {
				NODE_ENV: 'development',
			},
		},
	],
}
