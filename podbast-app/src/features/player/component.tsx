import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

import { play, selectStatus, selectMedia } from "./slice";
import { useAppDispatch, useAppSelector } from "/src/store";

import "@vidstack/react/player/styles/default/theme.css";

export const Player = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectStatus);
  const media = useAppSelector(selectMedia);

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
          <div>{status}</div>

          <MediaPlayer
            title={media?.title ?? ""}
            src={media?.url ?? ""}
            viewType="audio"
          >
            <MediaProvider />
            <DefaultAudioLayout icons={defaultLayoutIcons} smallLayoutWhen />
          </MediaPlayer>
        </div>
      </div>
    </>
  );
};
