import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface RssUrl {
  url: string;
  status: "requested" | "ready";
}

export interface RssState {
  urls: RssUrl[];
}

export const initialState: RssState = {
  urls: [],
};

export const slice = createSlice({
  name: "rss",
  initialState,
  reducers: {
    addUrl: (state, action: PayloadAction<string>) => {
      state.urls.push({
        url: action.payload,
        status: "requested",
      });
    },
    makeReady: (state, action: PayloadAction<string>) => {
      const ru = state.urls.find((ruc) => ruc.url === action.payload);
      if (ru) {
        ru.status = "ready";
      }
    },
  },
  selectors: {
    selectUrls: (state): RssUrl[] => state.urls,
    selectUrlsByStatus: (state, status: RssUrl["status"]): RssUrl[] => {
      return slice
        .getSelectors()
        .selectUrls(state)
        .filter((ru) => ru.status === status);
    },
  },
});

export const { actions, reducer, selectors } = slice;
