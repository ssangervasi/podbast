import { combineReducers } from "redux";

import { slice as commonSlice } from "/src/features/common/slice";
import { slice as playerSlice } from "/src/features/player/slice";
import { slice as rssSlice } from "/src/features/rss/slice";

export const rootReducer = combineReducers({
  [commonSlice.name]: commonSlice.reducer,
  [playerSlice.name]: playerSlice.reducer,
  [rssSlice.name]: rssSlice.reducer,
});
