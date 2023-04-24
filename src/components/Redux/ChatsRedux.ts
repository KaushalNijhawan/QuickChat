import { createSlice } from "@reduxjs/toolkit";
import { ChatUser } from "../Model and Interfaces/Models";

let initialState : ChatUser[] = [];


export const chatSlice = createSlice({
    name :"chats",
    initialState,
    reducers : {
        addChats: (state , action : {payload : ChatUser[]} )=>{
            if(action && action.payload){
                state = action.payload;
                state.sort((a, b) => a.timestamp - b.timestamp);
                return state;
            }
            return state;
        },
        appendChat : (state , action: {payload: ChatUser})=>{
            if(action && action.payload && action.payload.messageContent.length > 0){
                let found : Boolean = false;
                if(state){
                    for(let i = 0;i<state.length ;i++){
                        if(state[i].Id == action.payload.Id){
                            found = true;
                            break;
                        }
                    }
                }
                if(!found){
                    state = [...state , action.payload];
                    state.sort((a, b) => a.timestamp - b.timestamp);
                    return state;
                }
            }

            return state;
        }
    }
});

export const {addChats,  appendChat} = chatSlice.actions;

export default chatSlice.reducer;