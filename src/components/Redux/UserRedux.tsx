import { createSlice , PayloadAction} from '@reduxjs/toolkit';
interface User{
    username : string;
    token: string;
    email : string;
}
const initialState : User  = { 
    username : "",
    token : "" ,
    email : ""    
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        setCurrentUser:(state , action : {payload : {username: string , token : string , email : string}})=>{
            if(action && action.payload && action.payload.username  && action.payload.token){
                state.token = action.payload.token;
                state.username = action.payload.username;
                state.email = action.payload.email;
            }
        },
        resetState:(state , action: {payload :  any})=>{
            state = {
                username : "",
                token : "",
                email :""
            }
        },
    }
});

export const {setCurrentUser , resetState } = userSlice.actions;

export default userSlice.reducer;