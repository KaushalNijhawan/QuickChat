import { createSlice } from "@reduxjs/toolkit";
import { GroupChat } from "../Model and Interfaces/Models";

const initialState: GroupChat[] = [];

export const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        addGroups: (state, action : {payload : GroupChat[]}) => {
            if(action && action.payload){
                state = action.payload;
                return state;
            }
            return state;
        },
        appendGroups: (state , action: {payload : GroupChat})=>{
            if(action && action.payload){
                return [...state , action.payload];
            }
            return state;
        }
    }
});

export const {addGroups , appendGroups} = groupSlice.actions;
export default groupSlice.reducer;
