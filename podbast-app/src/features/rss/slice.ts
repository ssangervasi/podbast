import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { EMPTY_ARRAY } from "/src/store";

export interface RssUrl {
  url: string;
  status: "requested" | "ready";
}

export interface RssState {
  urls: RssUrl[];
}

export const initialState: RssState = {
  urls: EMPTY_ARRAY,
};

export const slice = createSlice({
  name: "rss",
  initialState,
  reducers: {
    addUrl: (state, action: PayloadAction<string>) => {
      const url = action.payload;

      const existing = state.urls.find((ru) => ru.url == url);
      if (existing) {
        existing.status = "requested";
        return;
      }

      state.urls.push({
        url,
        status: "requested",
      });
    },
    makeReady: (state, action: PayloadAction<string>) => {
      const url = action.payload;
      const ru = state.urls.find((ruc) => ruc.url === url);
      if (ru) {
        ru.status = "ready";
      }
    },
  },
});

export const { actions, reducer, selectSlice } = slice;
export const { makeReady, addUrl } = actions;
