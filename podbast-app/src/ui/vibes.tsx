import { ComponentType } from 'preact'
import { forwardRef } from 'preact/compat'

export function withDefaults<P>(
	Component: ComponentType<P>,
	defaults: Partial<P>,
) {
	return forwardRef((props: P, ref) => (
		<Component ref={ref} {...defaults} {...props} />
	)) as ComponentType<P>
}
