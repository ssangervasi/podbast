// import { useMemo } from "react";
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
	state: RootState
}>()

// Trying to make this convenient
// https://react-redux.js.org/api/hooks#using-memoizing-selectors
// export const useAppSelectorInstance: TypedUseSelectorHook<RootState> = (
//   ...args
// ) => {
//   const selector = useMemo(() => {
//     return createSelector([]);
//   }, []);
// };
