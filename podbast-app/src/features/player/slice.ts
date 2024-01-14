import { createSlice, prepareAutoBatched } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Media = {
  title: string;
  url: string;
  currentTime?: number;
};

type ReceiveMediaPlayer = {
  currentTime: number;
};

/**
 * Would be called "state" except that's confusing with RTK state.
 */
type Status = "stopped" | "paused" | "playing";

export type PlayerState = {
  status: Status;
  media?: Media;
  pendingRequest?: {
    status: Status;
    media?: Media;
  };
};

export const initialState: PlayerState = {
  status: "stopped",
};

export const slice = createSlice({
  name: "player",
  initialState,
  reducers: {
    play: (state, action: PayloadAction<Media>) => {
      state.pendingRequest = {
        status: "playing",
        media: action.payload,
      };
    },
    _clearRequest(state) {
      // Race condition?
      state.pendingRequest = undefined;
    },
    _receiveMediaPlayer: {
      reducer: (state, action: PayloadAction<ReceiveMediaPlayer>) => {
        if (!state.media) {
          return;
        }
        state.media.currentTime = action.payload.currentTime;
      },
      prepare: prepareAutoBatched<ReceiveMediaPlayer>(),
    },
  },
  selectors: {
    selectStatus: (state) => state.status,
    selectMedia: (state) => state.media,
    selectPendingRequest: (state) => state.pendingRequest,
  },
});

export const { actions, reducer } = slice;
export const { play, _receiveMediaPlayer, _clearRequest } = actions;
export const { selectStatus, selectMedia, selectPendingRequest } =
  slice.selectors;
