import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { wrapEmpty } from "/src/selectors";

export interface RssUrl {
  url: string;
  status: "requested" | "ready";
}

export interface RssState {
  urls: RssUrl[];
}

export const initialState: RssState = {
  urls: wrapEmpty.EMPTY_ARRAY,
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
  selectors: {
    selectUrls: (state): RssUrl[] => state.urls,
    selectUrlsByStatus: (state, status: RssUrl["status"]): RssUrl[] => {
      return wrapEmpty(
        slice
          .getSelectors()
          .selectUrls(state)
          .filter((ru) => ru.status === status)
      );
    },
  },
});

export const { actions, reducer, selectors, selectSlice } = slice;
