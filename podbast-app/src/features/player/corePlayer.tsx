import '@vidstack/react/player/styles/default/theme.css'

import {
	MediaPlayer,
	MediaPlayerInstance,
	MediaPlayerState,
	MediaProvider,
} from '@vidstack/react'
import {
	DefaultAudioLayout,
	defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default'
import { useEffect, useRef } from 'preact/hooks'

import { useAppDispatch, useAppSelector } from '/src/store'
import { useUpdatingRef } from '/src/utils'

import {
	_clearRequest,
	_receiveMediaPlayer,
	PlayRequest,
	selectMedia,
	selectPendingRequest,
	Status,
} from './slice'

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
	pendingRequest: PlayRequest
	mediaPlayerState: MediaPlayerState
}): boolean => {
	const src = mediaPlayerState.source.src
	const status = stateToStatus(mediaPlayerState)

	const statusIsSync = pendingRequest.status === status

	const srcIsSync = !pendingRequest.media || pendingRequest.media.url === src

	return statusIsSync && srcIsSync
}

const needsPlay = ({
	pendingRequest,
	mediaPlayerState,
}: {
	pendingRequest: PlayRequest
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
	pendingRequest: PlayRequest
	mediaPlayerState: MediaPlayerState
}): boolean => {
	if (pendingRequest.status !== 'paused') {
		return false
	}
	return stateToStatus(mediaPlayerState) !== 'paused'
}

export const CorePlayer = () => {
	const dispatch = useAppDispatch()

	const media = useAppSelector(selectMedia)
	const pendingRequest = useAppSelector(selectPendingRequest)

	const sliceMediaRef = useUpdatingRef({
		media,
		pendingRequest,
	})

	const mediaPlayerRef = useRef<MediaPlayerInstance>(null)

	useEffect(() => {
		const mediaPlayer = mediaPlayerRef.current
		if (!mediaPlayer) {
			return () => {}
		}

		return mediaPlayer.subscribe(mediaPlayerState => {
			const sliceMedia = sliceMediaRef.current
			// Beauuuutiful lol
			if (sliceMedia.pendingRequest) {
				if (
					isInSync({
						pendingRequest: sliceMedia.pendingRequest,
						mediaPlayerState,
					})
				) {
					dispatch(_clearRequest())
				}

				if (
					needsPause({
						pendingRequest: sliceMedia.pendingRequest,
						mediaPlayerState,
					})
				) {
					mediaPlayer.paused = true
				}

				if (
					needsPlay({
						pendingRequest: sliceMedia.pendingRequest,
						mediaPlayerState,
					})
				) {
					mediaPlayer.paused = false
				}
			}

			const { currentTime } = mediaPlayerState
			dispatch(_receiveMediaPlayer({ currentTime }))
		})
	}, [])

	return (
		<MediaPlayer
			ref={mediaPlayerRef}
			src={media?.url ?? ''}
			title={media?.title ?? ''}
			viewType="audio"
		>
			<MediaProvider />
			<DefaultAudioLayout icons={defaultLayoutIcons} smallLayoutWhen />
		</MediaPlayer>
	)
}
