import { configureStore  } from '@reduxjs/toolkit'
import { socketSlice } from  "./ClientRedux";
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
export const store = configureStore({
  reducer: {
    socket  : socketSlice.reducer
  },
});

export const useAppDispatch:() => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;