// https://eslint.org/docs/user-guide/configuring
module.exports = {
	env: {
		browser: true,
		node: false,
	},
	//
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:prettier/recommended',
		'../.eslintrc.cjs',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'simple-import-sort', 'prettier'],
	ignorePatterns: ['.eslintrc.cjs'],
}
