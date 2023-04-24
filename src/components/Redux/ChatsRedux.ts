import { createSlice } from "@reduxjs/toolkit";
import { ChatUser } from "../Model and Interfaces/Models";

let initialState : ChatUser[] = [];


export const chatSlice = createSlice({
    name :"chats",
    initialState,
    reducers : {
        addChats: (state , action : {payload : ChatUser[]} )=>{
            console.log(action);
            if(action && action.payload){
                state = action.payload;
                state.sort((a, b) => a.timestamp - b.timestamp);
                return state;
            }
            return state;
        }
    }
});

export const {addChats} = chatSlice.actions;

export default chatSlice.reducer;