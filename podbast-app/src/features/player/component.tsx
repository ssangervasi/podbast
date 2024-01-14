import { useCallback, useEffect, useRef } from "preact/hooks";

import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MediaPlayRequestEvent,
} from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

import {
  selectStatus,
  selectMedia,
  _receiveMediaPlayer,
  _clearRequest,
  selectPendingRequest,
} from "./slice";
import { useAppDispatch, useAppSelector } from "/src/store";

import "@vidstack/react/player/styles/default/theme.css";

const CorePlayer = () => {
  const dispatch = useAppDispatch();

  const media = useAppSelector(selectMedia);
  const pendingRequest = useAppSelector(selectPendingRequest);

  const mediaStateRef = useRef({
    media,
    pendingRequest,
  });
  mediaStateRef.current.media = media;
  mediaStateRef.current.pendingRequest = pendingRequest;

  const mediaPlayerRef = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    const mediaPlayer = mediaPlayerRef.current;
    if (!mediaPlayer) {
      return () => {};
    }

    return mediaPlayer.subscribe((mediaPlayerState) => {
      mediaPlayerState.source.src;
      const { currentTime } = mediaPlayerState;
      dispatch(_receiveMediaPlayer({ currentTime }));
    });
  }, []);

  // useEffect(() => {
  //   if (!pendingRequest) {
  //     return;
  //   }

  //   const mediaPlayer = mediaPlayerRef.current;
  //   if (!mediaPlayer) {
  //     return;
  //   }

  //   if (pendingRequest.status == "playing") {
  //     mediaPlayer.play();
  //   }
  //   mediaPlayer.play();
  // }, [dispatch, pendingRequest]);

  return (
    <MediaPlayer
      ref={mediaPlayerRef}
      src={media?.url ?? ""}
      title={media?.title ?? ""}
      viewType="audio"
    >
      <MediaProvider />
      <DefaultAudioLayout icons={defaultLayoutIcons} smallLayoutWhen />
    </MediaPlayer>
  );
};

export const Player = () => {
  return (
    <>
      {/* Spacer to ensure fixed content position doesn't hide main content*/}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          // height: 120,
        }}
      />

      <div
        style={{
          // height: 120,
          position: "fixed",
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "#202535",
          //
          display: "flex",
          flexDirection: "row",
          placeContent: "center",
          placeItems: "center",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            placeContent: "center",
            placeItems: "start",
            gap: "8px",
          }}
        >
          <div>Player</div>

          <CorePlayer />
        </div>
      </div>
    </>
  );
};
