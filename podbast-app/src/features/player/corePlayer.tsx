import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/audio.css'

import { Box } from '@chakra-ui/react'
import {
	MediaPlayer,
	MediaPlayerInstance,
	MediaPlayerState,
	MediaProvider,
} from '@vidstack/react'
import { StopIcon } from '@vidstack/react/icons'
import {
	DefaultAudioLayout,
	defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default'
import { Ref, useCallback, useEffect, useMemo, useRef } from 'preact/hooks'

import { useAppDispatch, useAppSelector } from '/src/store'
import { AppDispatch } from '/src/store/store'
import { isAround, log, useUpdatingRef } from '/src/utils'
import { createThrottler } from '/src/utils/throttler'

import {
	_clearRequest,
	_receiveMediaUpdate,
	makeRequest,
	Media,
	MediaUpdate,
	selectMedia,
	selectPendingRequest,
	Status,
} from './slice'

const logger = log.with({ prefix: 'corePlayer' })

const stateToStatus = (mediaPlayerState: MediaPlayerState): Status => {
	const { paused, playing } = mediaPlayerState
	if (paused) {
		return 'paused'
	}
	if (playing) {
		return 'playing'
	}
	return 'stopped'
}

type Scope = {
	media: Media | undefined
	pendingRequest: MediaUpdate | undefined
}

type SubscriberContext = {
	dispatch: AppDispatch
	scopeRef: Ref<Scope>
	mediaPlayerRef: Ref<MediaPlayerInstance>
}

const buildStateAsUpdate = ({
	mediaPlayerState,
	media,
}: {
	mediaPlayerState: MediaPlayerState
	media: Media | undefined
}): MediaUpdate => {
	const status = stateToStatus(mediaPlayerState)
	const {
		currentTime,
		source: { src },
	} = mediaPlayerState

	const updatedMedia =
		media && media.src === src
			? {
					...media,
					currentTime,
				}
			: undefined

	return {
		status,
		media: updatedMedia,
	}
}

const createMediaPlayerSubscriber =
	({ scopeRef, mediaPlayerRef, dispatch }: SubscriberContext) =>
	(mediaPlayerState: MediaPlayerState) => {
		const mediaPlayer = mediaPlayerRef.current
		const scope = scopeRef.current
		if (!(mediaPlayer && scope)) {
			return
		}

		const { media, pendingRequest } = scope

		const mediaStateAsUpdate = buildStateAsUpdate({
			mediaPlayerState,
			media,
		})

		if (!pendingRequest) {
			dispatchUpdate({ dispatch, mediaStateAsUpdate })
			return
		}

		if (
			needsSync({
				pendingRequest,
				mediaStateAsUpdate,
			})
		) {
			syncMediaPlayer({
				pendingRequest,
				mediaPlayer,
			})
			return
		}

		dispatch(_clearRequest())
	}

// I bet there's a nicer way to wrap dispatch...
const dispatchUpdate = ({
	dispatch,
	mediaStateAsUpdate,
}: {
	dispatch: AppDispatch
	mediaStateAsUpdate: MediaUpdate
}) => {
	if (mediaStateAsUpdate.status === 'playing') {
		progressThrottler(() => {
			dispatch(_receiveMediaUpdate(mediaStateAsUpdate))
		})
		return
	}

	dispatch(_receiveMediaUpdate(mediaStateAsUpdate))
}

const progressThrottler = createThrottler(5_000)

const needsSync = ({
	pendingRequest,
	mediaStateAsUpdate,
}: {
	pendingRequest: MediaUpdate
	mediaStateAsUpdate: MediaUpdate
}): boolean => {
	// Sync needed for status
	if (pendingRequest.status !== mediaStateAsUpdate.status) {
		return true
	}

	// Sync needed to seek time only if the player's time is more than 1 second off.
	const seekTime = pendingRequest.media?.currentTime
	const mediaTime = mediaStateAsUpdate.media?.currentTime
	if (seekTime !== undefined && mediaTime !== undefined) {
		if (!isAround(seekTime, 1, mediaTime)) {
			return true
		}
	}

	return false
}

const syncMediaPlayer = ({
	pendingRequest,
	mediaPlayer,
}: {
	pendingRequest: MediaUpdate
	mediaPlayer: MediaPlayerInstance
}) => {
	if (pendingRequest.status === 'playing') {
		mediaPlayer.paused = false
	} else {
		mediaPlayer.paused = true
	}

	const seekTime = pendingRequest.media?.currentTime
	if (seekTime !== undefined) {
		mediaPlayer.currentTime = seekTime
	}
}

export const CorePlayer = () => {
	const dispatch = useAppDispatch()

	const media = useAppSelector(selectMedia)
	const pendingRequest = useAppSelector(selectPendingRequest)

	const mediaForPlayer: Media | undefined = useMemo(() => {
		if (pendingRequest?.status === 'stopped') {
			return undefined
		}
		if (pendingRequest?.media) {
			return pendingRequest.media
		}
		return media
	}, [media, pendingRequest])

	const scopeRef = useUpdatingRef({
		media,
		pendingRequest,
		mediaForPlayer,
	})

	const mediaPlayerRef = useRef<MediaPlayerInstance>(null)

	const subscriber = useMemo(() => {
		return createMediaPlayerSubscriber({
			scopeRef,
			mediaPlayerRef,
			dispatch,
		})
	}, [])

	useEffect(() => {
		// On first load, push a request to sync the player with the last stored state.
		dispatch(
			makeRequest({
				status: 'paused',
				media,
			}),
		)
	}, [])

	useEffect(() => {
		// Fire the subscriber whenever the pendingRequest changes. The MediaPlayer's
		// events may not be firing (paused or stopped).

		const mediaPlayer = mediaPlayerRef.current
		if (!mediaPlayer) {
			return
		}

		logger.debug('manual call to subscriber')
		subscriber(mediaPlayer.state)
	}, [pendingRequest, subscriber, mediaPlayerRef.current])

	useEffect(() => {
		// Subscribe to every event from the MediaPlayer
		const mediaPlayer = mediaPlayerRef.current
		if (!mediaPlayer) {
			return () => {}
		}

		return mediaPlayer.subscribe(subscriber)
	}, [mediaPlayerRef.current])

	const handleClickStop = useCallback(() => {
		dispatch(
			makeRequest({
				status: 'stopped',
			}),
		)
	}, [])

	return (
		<Box
			width="full"
			sx={{
				'--audio-bg': 'transparent',
				'--audio-border': 'none',
				'.vds-stop-button': {
					marginRight: 2,
				},
			}}
		>
			<MediaPlayer
				ref={mediaPlayerRef}
				src={mediaForPlayer?.src ?? ''}
				title={mediaForPlayer?.title ?? ''}
				viewType="audio"
			>
				<MediaProvider />
				<DefaultAudioLayout
					smallLayoutWhen={false}
					icons={defaultLayoutIcons}
					slots={{
						beforePlayButton: (
							<button
								aria-label="Stop"
								class="vds-button vds-stop-button"
								onClick={handleClickStop}
							>
								<StopIcon />
							</button>
							// <button class="vds-button"
							// 	aria-label="Stop"
							// 	boxSize={18}
							// 	colorScheme="white"
							// 	backgroundColor="white"
							// 	// color="transparent"
							// 	border="none"
							// 	icon={<StopIcon color="black" />}
							// />
						),
						settingsMenu: null,
					}}
				/>
			</MediaPlayer>
		</Box>
	)
}
