import { createSelector } from "@reduxjs/toolkit";
import { selectSlice, RssUrl } from "./slice";
import { wrapEmpty } from "/src/store";

export const selectUrls = createSelector([selectSlice], (state) => state.urls);

export const rawSelectUrlsByStatus = createSelector(
  [selectUrls, (_, status: RssUrl["status"]) => status],
  (urls, status) => {
    console.log("rawSelectUrlsByStatus", status);
    return wrapEmpty(urls.filter((ru) => ru.status === status));
  }
);

export const createSelectUrlsByStatus = () =>
  createSelector(
    [selectUrls, (_, status: RssUrl["status"]) => status],
    (urls, status) => {
      console.log("createSelectUrlsByStatus", status);

      return wrapEmpty(urls.filter((ru) => ru.status === status));
    }
  );
