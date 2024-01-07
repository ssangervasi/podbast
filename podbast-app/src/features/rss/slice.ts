import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { EMPTY_ARRAY, wrapEmpty } from "/src/store/utils";
import { fetchFeed } from "./thunks";
import { Feed } from "/src/features/rss/guards";
import { FEED } from "/src/features/rss/fixtures";

export type RssSubscription = {
  url: string;
} & (
  | {
      status: "requested";
      feed?: undefined;
    }
  | {
      status: "ready";
      feed: Feed;
    }
);

export interface RssState {
  subscriptions: RssSubscription[];
}

export const initialState: RssState = {
  subscriptions: EMPTY_ARRAY,
};

export const slice = createSlice({
  name: "rss",
  initialState,
  reducers: {
    addSubscription: (state, action: PayloadAction<string>) => {
      const url = action.payload;

      const existing = state.subscriptions.find((ru) => ru.url == url);
      if (existing) {
        existing.status = "requested";
        return;
      }

      state.subscriptions.push({
        url,
        status: "requested",
      });
    },
    makeReady: (state, action: PayloadAction<string>) => {
      const url = action.payload;
      const rsub = state.subscriptions.find((ruc) => ruc.url === url);
      if (!rsub) {
        console.error("makeReady: No subscription for url");
        return;
      }

      rsub.status = "ready";
      rsub.feed = FEED;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, () => {})
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const rsub = state.subscriptions.find(
          (ruc) => ruc.url === action.meta.arg
        );

        const attrs = {
          status: "ready",
          feed: action.payload,
        };

        if (rsub) {
          Object.assign(rsub, attrs);
        } else {
          console.error("No RU for feed fulf");
        }
      })
      .addCase(fetchFeed.rejected, () => {});
  },
  selectors: {
    selectSubscriptions: (state): RssSubscription[] => state.subscriptions,
    selectSubscriptionsByStatus: (
      state,
      status: RssSubscription["status"]
    ): RssSubscription[] => {
      return wrapEmpty(
        slice
          .getSelectors()
          .selectSubscriptions(state)
          .filter((ru) => ru.status === status)
      );
    },
  },
});

export const { actions, reducer } = slice;
export const { makeReady, addSubscription } = actions;
export const { selectSubscriptions, selectSubscriptionsByStatus } =
  slice.selectors;
