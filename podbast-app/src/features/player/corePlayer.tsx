import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/audio.css'

import { Box, Text } from '@chakra-ui/react'
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
	PlayerState,
	selectState,
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

type SubscriberContext = {
	dispatch: AppDispatch
	scopeRef: Ref<PlayerState>
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
		duration,
		volume,
		source: { src },
	} = mediaPlayerState

	const updatedMedia =
		media && media.src === src
			? ({
					...media,
					currentTime,
					durationTime: duration,
				} satisfies Media)
			: undefined

	return {
		status,
		volume,
		media: updatedMedia,
	}
}

class MediaPlayerSubscriber {
	context: SubscriberContext

	constructor(context: SubscriberContext) {
		this.context = context
	}

	get dispatch() {
		return this.context.dispatch
	}

	get scope() {
		return this.context.scopeRef.current
	}

	get mediaPlayer() {
		return this.context.mediaPlayerRef.current
	}

	handleSubscribe = (mediaPlayerState: MediaPlayerState) => {
		if (!(this.mediaPlayer && this.scope)) {
			return
		}

		const { media, pendingRequest } = this.scope

		const mediaStateAsUpdate = buildStateAsUpdate({
			mediaPlayerState,
			media,
		})

		if (!pendingRequest) {
			this.dispatchUpdate(mediaStateAsUpdate)
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
				mediaPlayer: this.mediaPlayer,
			})
			return
		}

		this.dispatch(_clearRequest())
	}

	dispatchUpdate(mediaStateAsUpdate: MediaUpdate) {
		if (mediaStateAsUpdate.status === 'playing') {
			progressThrottler(() => {
				this.dispatch(_receiveMediaUpdate(mediaStateAsUpdate))
			})
			return
		}

		this.dispatch(_receiveMediaUpdate(mediaStateAsUpdate))
	}
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

	// Sync needed for volume only if the player's volume is more than 1% off.
	const reqVolume = pendingRequest.volume
	const mediaVolume = mediaStateAsUpdate.volume
	if (reqVolume !== undefined && mediaVolume !== undefined) {
		if (!isAround(reqVolume, 0.01, mediaVolume)) {
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

	const reqVolume = pendingRequest.volume
	if (reqVolume !== undefined) {
		mediaPlayer.volume = reqVolume
	}
}

export const CorePlayer = () => {
	const dispatch = useAppDispatch()

	const playerState = useAppSelector(selectState)

	const mediaForPlayer: Media | undefined = useMemo(() => {
		const { pendingRequest, media } = playerState
		if (pendingRequest?.status === 'stopped') {
			return undefined
		}
		if (pendingRequest?.media) {
			return pendingRequest.media
		}
		return media
	}, [playerState])

	const scopeRef = useUpdatingRef(playerState)

	const mediaPlayerRef = useRef<MediaPlayerInstance>(null)

	const subscriber = useMemo(() => {
		return new MediaPlayerSubscriber({
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
				media: playerState.media,
				volume: playerState.volume,
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
		subscriber.handleSubscribe(mediaPlayer.state)
	}, [playerState.pendingRequest, subscriber, mediaPlayerRef.current])

	useEffect(() => {
		// Subscribe to every event from the MediaPlayer
		const mediaPlayer = mediaPlayerRef.current
		if (!mediaPlayer) {
			return () => {}
		}

		return mediaPlayer.subscribe(subscriber.handleSubscribe)
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
