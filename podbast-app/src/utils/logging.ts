import { isDev, isTest } from './isDev'

type LoggerContext = {
	level: 'error' | 'info' | 'debug' | 'warn'
	prefix: string
}

const DEFAULT_CONTEXT: LoggerContext = {
	level: 'info',
	prefix: '',
}

const endLog = (context: Partial<LoggerContext>, ...args: unknown[]) => {
	const { prefix, level } = { ...DEFAULT_CONTEXT, ...context }

	if (level === 'debug' && !(isDev() || isTest())) {
		return
	}

	const preArr = prefix ? [`[${prefix}]`] : []
	console[level](...preArr, ...args)
}

export type Logger = {
	(...args: unknown[]): void
	info: (...args: unknown[]) => void
	warn: (...args: unknown[]) => void
	debug: (...args: unknown[]) => void
	error: (...args: unknown[]) => void

	with: (innerContext: Partial<LoggerContext>) => Logger
}

const withLoggerContext = (context: Partial<LoggerContext>): Logger => {
	const innerLogger = (...args: unknown[]) => endLog(context, ...args)

	return Object.assign(innerLogger, {
		info: (...args: unknown[]) =>
			endLog({ ...context, level: 'info' }, ...args),
		warn: (...args: unknown[]) =>
			endLog({ ...context, level: 'warn' }, ...args),
		debug: (...args: unknown[]) =>
			endLog({ ...context, level: 'debug' }, ...args),
		error: (...args: unknown[]) =>
			endLog({ ...context, level: 'error' }, ...args),

		with: (innerContext: Partial<LoggerContext>) =>
			withLoggerContext({
				...context,
				...innerContext,
			}),
	})
}

export const log = withLoggerContext({})

const deltaState = {
	lastMs: 0,
}

const nextDelta = () => {
	const prev = deltaState.lastMs
	const now = Date.now()
	deltaState.lastMs = now

	if (prev === 0) {
		return 0
	}

	return now - prev
}

export const logDelta = (...args: unknown[]) =>
	withLoggerContext({ prefix: `${nextDelta()}ms` })(...args)
