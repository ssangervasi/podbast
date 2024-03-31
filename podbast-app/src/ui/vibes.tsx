import { ComponentType } from 'preact'

export function withDefaults<P>(
	Component: ComponentType<P>,
	defaults: Partial<P>,
) {
	return (props: P) => <Component {...defaults} {...props} />
}
