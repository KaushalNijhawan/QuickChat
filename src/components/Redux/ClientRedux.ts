import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
interface SocketObject {
  io: any;
}

const initialState: SocketObject = {
  io: null,
};

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
         setConnection: (state ,  action : {payload: Socket}) =>{
            if(action && action.payload ){
                state.io = action.payload;
            }
         }
    },
  });

export const { setConnection } = socketSlice.actions;
export default socketSlice.reducer;
