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
         },
         resetConnection:(state, action: {payload:any}) =>{
            state.io = null;
         }
    },
  });

export const { setConnection , resetConnection} = socketSlice.actions;
export default socketSlice.reducer;
