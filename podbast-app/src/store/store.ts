import { enableMapSet } from "immer";
import { configureStore } from "@reduxjs/toolkit";

import { slice as commonSlice } from "/src/features/common/slice";
import { slice as rssSlice } from "/src/features/rss/slice";

enableMapSet();

export const store = configureStore({
  reducer: {
    [commonSlice.name]: commonSlice.reducer,
    [rssSlice.name]: rssSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    const m = getDefaultMiddleware({
      thunk: true,
    });
    console.log("middle", m);
    return m;
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
