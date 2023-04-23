import { configureStore  } from '@reduxjs/toolkit'
import { socketSlice } from  "./ClientRedux";
import {userSlice} from "./UserRedux";
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { chatSlice } from './ChatsRedux';
export const store = configureStore({
  reducer: {
    socket  : socketSlice.reducer,
    user : userSlice.reducer,
    chat : chatSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck : false}),
});

export const useAppDispatch:() => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;