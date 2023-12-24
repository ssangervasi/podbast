import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { EMPTY_ARRAY, wrapEmpty } from "/src/store/utils";
import { fetchFeed } from "./thunks";

export interface RssUrl {
  url: string;
  status: "requested" | "ready";
  feed?: Record<string, unknown>;
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
        ru.feed = {
          title: "Dummy content",
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, () => {})
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const ru = state.urls.find((ruc) => ruc.url === action.meta.arg);

        const attrs = {
          status: "ready",
          feed: action.payload,
        };

        if (ru) {
          Object.assign(ru, attrs);
        } else {
          console.error("No RU for feed fulf");
        }
      })
      .addCase(fetchFeed.rejected, () => {});
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

export const { actions, reducer } = slice;
export const { makeReady, addUrl } = actions;
export const { selectUrls, selectUrlsByStatus } = slice.selectors;
