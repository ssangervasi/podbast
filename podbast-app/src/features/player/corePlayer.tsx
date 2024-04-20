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

const needsPlay = ({
	scope: { pendingRequest },
	mediaPlayerState,
}: SubscriberHandlerContext): boolean => {
	if (pendingRequest?.status !== 'playing') {
		return false
	}
	return stateToStatus(mediaPlayerState) !== 'playing'
}

const needsPause = ({
	scope: { pendingRequest },
	mediaPlayerState,
}: SubscriberHandlerContext): boolean => {
	if (pendingRequest?.status !== 'paused') {
		return false
	}
	return stateToStatus(mediaPlayerState) !== 'paused'
}

const needsStop = ({
	scope: { pendingRequest },
	mediaPlayerState,
}: SubscriberHandlerContext): boolean => {
	if (pendingRequest?.status !== 'stopped') {
		return false
	}
	return stateToStatus(mediaPlayerState) === 'playing'
}

const checkSeek = ({
	scope: { pendingRequest },
	mediaPlayerState,
}: SubscriberHandlerContext): undefined | { seekTime: number } => {
	const seekTime = pendingRequest?.media?.currentTime
	if (seekTime === undefined) {
		return undefined
	}

	const mediaTime = mediaPlayerState.currentTime
	if (isAround(seekTime, 1, mediaTime)) {
		return undefined
	}

	return { seekTime }
}

// Should probably just put stuff in a thunk
type Scope = {
	media: Media | undefined
	pendingRequest: MediaUpdate | undefined
}

type SubscriberContext = {
	dispatch: AppDispatch
	scopeRef: Ref<Scope>
	mediaPlayerRef: Ref<MediaPlayerInstance>
}

type SubscriberHandlerContext = {
	dispatch: AppDispatch
	scope: Scope
	mediaPlayer: MediaPlayerInstance
	mediaPlayerState: MediaPlayerState
}

const handleUpdateMedia = ({
	dispatch,
	scope,
	mediaPlayerState,
}: SubscriberHandlerContext) => {
	const status = stateToStatus(mediaPlayerState)
	const { currentTime } = mediaPlayerState
	const media = scope.media
		? {
				...scope.media,
				currentTime,
			}
		: undefined

	log.debug('handleUpdateMedia', { status, currentTime })
	dispatch(
		updateMedia({
			status,
			media,
		}),
	)
}

const handlePendingRequest = (context: SubscriberHandlerContext) => {
	if (needsPlay(context)) {
		log.debug('needsPlay')
		context.mediaPlayer.paused = false
		return
	}

	if (needsPause(context)) {
		log.debug('needsPause')
		context.mediaPlayer.paused = true
		return
	}

	if (needsStop(context)) {
		log.debug('needsStop')
		context.mediaPlayer.paused = true
		return
	}

	const seekResult = checkSeek(context)
	if (seekResult) {
		log.debug('seekResult', seekResult)
		context.mediaPlayer.currentTime = seekResult.seekTime
		return
	}

	if (context.scope.pendingRequest) {
		context.dispatch(_clearRequest())
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

		const handlerContext: SubscriberHandlerContext = {
			scope,
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
		const mediaPlayer = mediaPlayerRef.current
		if (!mediaPlayer) {
			return
		}
		subscriber(mediaPlayer.state)
	}, [subscriber, pendingRequest, mediaPlayerRef.current])

	useEffect(() => {
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

	useEffect(() => {
		log.debug('mediaForPlayer', mediaForPlayer)
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
