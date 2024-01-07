import { combineReducers } from "redux";

import { slice as commonSlice } from "/src/features/common/slice";
import { slice as rssSlice } from "/src/features/rss/slice";

export const rootReducer = combineReducers({
  [commonSlice.name]: commonSlice.reducer,
  [rssSlice.name]: rssSlice.reducer,
});
