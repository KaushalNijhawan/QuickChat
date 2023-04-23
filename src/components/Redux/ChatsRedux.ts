import { createSlice } from "@reduxjs/toolkit";

interface ChatUser{
    fromUsername: string;
    toUsername : string;
    messageContent : string;
}

let initialState : ChatUser[] = [];


export const chatSlice = createSlice({
    name :"chats",
    initialState,
    reducers : {
        addChats: (state , action : {payload : ChatUser} )=>{
            if(action && action.payload){
                return [...state , action.payload];
            }
            return state;
        }
    }
});

export const {addChats} = chatSlice.actions;

export default chatSlice.reducer;