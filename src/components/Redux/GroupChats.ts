import { createSlice } from "@reduxjs/toolkit";
import { GroupChatMessage } from "../Model and Interfaces/Models";
import { enableMapSet } from 'immer';

enableMapSet();


const initialState : Map<String ,GroupChatMessage[]> = new Map();

export const groupChatSlice = createSlice({
    name :"groupChat",
    initialState,
    reducers : {
        addGroupChats: (state , action : {payload : GroupChatMessage[]}) =>{
            let stateMap = new Map<String , GroupChatMessage[]>();
            action.payload.map((chat) =>{
                if(stateMap.has(chat.groupTitle)){
                    let groupChat : GroupChatMessage[] = stateMap.get(chat.groupTitle) as GroupChatMessage[];
                    stateMap.set(chat.groupTitle , [...groupChat , chat]);
                }else{
                    stateMap.set(chat.groupTitle , [chat]);
                }
            })
            state = stateMap;
            Array.from(state.keys()).map((chatTitle) =>{
                // if(){
                // }
                state.get(chatTitle)?.sort((a,b)=> a.timestamp - b.timestamp);
            });
            return state;
        },
        appendGroupChats : (state , action : {payload : GroupChatMessage}) =>{
            if(action && action.payload){
                if(action.payload.messageContent.length > 0 && state.has(action.payload.groupTitle)){
                    let groupChat : GroupChatMessage[] =  state.get(action.payload.groupTitle) as GroupChatMessage[];
                    let found : boolean = false;
                    let size : number = state.get(action.payload.groupTitle)?.length as number;
                    let groupChats : GroupChatMessage[] = state.get(action.payload.groupTitle) as GroupChatMessage[];
                    for(let i = 0;i<size;i++){
                       if(groupChats[i]?.Id == action.payload.Id){
                            found = true;
                       } 
                    } 
                    if(!found){
                        state.set(action.payload.groupTitle , [...groupChat , action.payload]);
                    }
                }else if(!state.has(action.payload.groupTitle)){
                    state.set(action.payload.groupTitle, [action.payload]);
                }
            }
            return state;
        },
        resetChats:(state, action: {payload : any})=>{
            state = new Map<String , GroupChatMessage[]>();
        }
    }
});

export const {addGroupChats , appendGroupChats , resetChats} = groupChatSlice.actions;

export default groupChatSlice.reducer;