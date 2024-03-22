import { useLayout } from './useLayout'

export const Main = () => {
	const { layout } = useLayout()

	return <layout.main />
}
