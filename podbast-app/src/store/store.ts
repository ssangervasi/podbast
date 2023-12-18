import { configureStore } from "@reduxjs/toolkit";

import { slice as commonSlice } from "/src/features/common/slice";

export const store = configureStore({
  reducer: {
    [commonSlice.name]: commonSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
