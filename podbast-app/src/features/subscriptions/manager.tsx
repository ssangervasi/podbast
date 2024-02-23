import { useEffect } from 'preact/hooks'

import { useAppDispatch, useAppSelector } from '/src/store'
import { log } from '/src/utils'

import { selectSubscriptions } from './slice'

export const Manager = () => {
	const subscriptions = useAppSelector(selectSubscriptions)

	useEffect(() => {
		log.info('subscriptions changed')
	}, [subscriptions])

	return <></>
}
