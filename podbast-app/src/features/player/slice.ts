import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PlayerState {
  status: "stopped" | "paused" | "playing";
}

export const initialState: PlayerState = {
  status: "stopped",
};

export const slice = createSlice({
  name: "player",
  initialState,
  reducers: {
    play: (state, action: PayloadAction<string>) => {
      state.status = "playing";
    },
  },
  selectors: {
    selectStatus: (state) => state.status,
  },
});

export const { actions, reducer } = slice;
export const { play } = actions;
export const { selectStatus } = slice.selectors;
