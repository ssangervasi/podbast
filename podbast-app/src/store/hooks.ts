// import { useMemo } from "react";
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from './store'
// import { createSelector } from "@reduxjs/toolkit";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Trying to make this convenient
// https://react-redux.js.org/api/hooks#using-memoizing-selectors
// export const useAppSelectorInstance: TypedUseSelectorHook<RootState> = (
//   ...args
// ) => {
//   const selector = useMemo(() => {
//     return createSelector([]);
//   }, []);
// };
