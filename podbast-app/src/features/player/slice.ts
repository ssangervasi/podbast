import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Media = {
  title: string;
  url: string;
};

export type PlayerState = {
  status: "stopped" | "paused" | "playing";
  media?: Media;
};

export const initialState: PlayerState = {
  status: "stopped",
};

export const slice = createSlice({
  name: "player",
  initialState,
  reducers: {
    play: (state, action: PayloadAction<Media>) => {
      state.status = "playing";
      state.media = action.payload;
    },
  },
  selectors: {
    selectStatus: (state) => state.status,
    selectMedia: (state) => state.media,
  },
});

export const { actions, reducer } = slice;
export const { play } = actions;
export const { selectStatus, selectMedia } = slice.selectors;
