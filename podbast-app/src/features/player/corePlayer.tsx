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
import { Ref, useCallback, useEffect, useRef } from 'preact/hooks'

import { useAppDispatch, useAppSelector } from '/src/store'
import { AppDispatch } from '/src/store/store'
import { log, useUpdatingRef } from '/src/utils'

import {
	_clearRequest,
	makeRequest,
	Media,
	MediaUpdate,
	selectMedia,
	selectPendingRequest,
	Status,
} from './slice'
import { updateMedia } from './thunks'

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

const isInSync = ({
	pendingRequest,
	mediaPlayerState,
}: {
	pendingRequest: MediaUpdate
	mediaPlayerState: MediaPlayerState
}): boolean => {
	const src = mediaPlayerState.source.src
	const status = stateToStatus(mediaPlayerState)

	const statusIsSync = pendingRequest.status === status
	const srcIsSync = !pendingRequest.media || pendingRequest.media.src === src

	return statusIsSync && srcIsSync
}

const needsPlay = ({
	pendingRequest,
	mediaPlayerState,
}: {
	pendingRequest: MediaUpdate
	mediaPlayerState: MediaPlayerState
}): boolean => {
	if (pendingRequest.status !== 'playing') {
		return false
	}
	return stateToStatus(mediaPlayerState) !== 'playing'
}

const needsPause = ({
	pendingRequest,
	mediaPlayerState,
}: {
	pendingRequest: MediaUpdate
	mediaPlayerState: MediaPlayerState
}): boolean => {
	if (pendingRequest.status !== 'paused') {
		return false
	}
	return stateToStatus(mediaPlayerState) !== 'paused'
}

const needsStop = ({
	pendingRequest,
	mediaPlayerState,
}: {
	pendingRequest: MediaUpdate
	mediaPlayerState: MediaPlayerState
}): boolean => {
	if (pendingRequest.status !== 'stopped') {
		return false
	}
	return stateToStatus(mediaPlayerState) === 'playing'
}

// Should probably just put stuff in a thunk
type LastSliceState = {
	media: Media | undefined
	pendingRequest: MediaUpdate | undefined
}

type SubscriberContext = {
	dispatch: AppDispatch
	lastSliceRef: Ref<LastSliceState>
	mediaPlayerRef: Ref<MediaPlayerInstance>
}

type SubscriberHandlerContext = {
	dispatch: AppDispatch
	lastSlice: LastSliceState
	mediaPlayer: MediaPlayerInstance
	mediaPlayerState: MediaPlayerState
}

const handleUpdateMedia = ({
	dispatch,
	lastSlice,
	mediaPlayerState,
}: SubscriberHandlerContext) => {
	const { currentTime } = mediaPlayerState
	const status = stateToStatus(mediaPlayerState)
	log.info('handleUpdateMedia', { status, currentTime })
	dispatch(
		updateMedia({
			status,
			media: {
				...lastSlice.media,
				currentTime,
			},
		}),
	)
}

const handlePendingRequest = ({
	dispatch,
	lastSlice,
	mediaPlayer,
	mediaPlayerState,
}: SubscriberHandlerContext) => {
	const { pendingRequest } = lastSlice
	log.info('handlePendingRequest', pendingRequest)
	if (!pendingRequest) {
		return
	}

	if (
		isInSync({
			pendingRequest,
			mediaPlayerState,
		})
	) {
		log.info('in sync')
		dispatch(_clearRequest())
		return
	}

	if (
		needsPause({
			pendingRequest,
			mediaPlayerState,
		})
	) {
		mediaPlayer.paused = true
		return
	}

	if (
		needsPlay({
			pendingRequest,
			mediaPlayerState,
		})
	) {
		mediaPlayer.paused = false
		return
	}

	if (
		needsStop({
			pendingRequest,
			mediaPlayerState,
		})
	) {
		mediaPlayer.paused = true
		return
	}
}

const createMediaPlayerSubscriber =
	({ lastSliceRef, mediaPlayerRef, dispatch }: SubscriberContext) =>
	(mediaPlayerState: MediaPlayerState) => {
		const mediaPlayer = mediaPlayerRef.current
		const lastSlice = lastSliceRef.current
		if (!(mediaPlayer && lastSlice)) {
			return
		}

		const handlerContext: SubscriberHandlerContext = {
			lastSlice,
			mediaPlayer,
			mediaPlayerState,
			dispatch,
		}

		handlePendingRequest(handlerContext)
		handleUpdateMedia(handlerContext)
	}

export const CorePlayer = () => {
	const dispatch = useAppDispatch()

	const media = useAppSelector(selectMedia)
	const pendingRequest = useAppSelector(selectPendingRequest)

	const lastSliceRef = useUpdatingRef({
		media,
		pendingRequest,
	})

	const mediaPlayerRef = useRef<MediaPlayerInstance>(null)

	// const subscriber = useMemo(() => {
	// 	return createMediaPlayerSubscriber({
	// 		lastSliceRef,
	// 		mediaPlayerRef,
	// 		dispatch,
	// 	}),
	// }, [])

	useEffect(() => {
		const mediaPlayer = mediaPlayerRef.current
		if (!mediaPlayer) {
			log.info('no media player')
			return () => {}
		}

		return mediaPlayer.subscribe(
			createMediaPlayerSubscriber({
				lastSliceRef,
				mediaPlayerRef,
				dispatch,
			}),
		)
	}, [])

	const handleClickStop = useCallback(() => {
		dispatch(
			makeRequest({
				status: 'stopped',
			}),
		)
	}, [])

	const mediaForPlayer = media ?? pendingRequest?.media

	useEffect(() => {
		log.info('mediaForPlayer', mediaForPlayer)
	}, [mediaForPlayer])

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
