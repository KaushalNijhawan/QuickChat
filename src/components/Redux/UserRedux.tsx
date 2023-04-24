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
        setCurrentUser:(state , action : any)=>{
            if(action && action.payload && action.payload.username  && action.payload.token){
                state.token = action.payload.token;
                state.username = action.payload.username;
                state.email = action.payload.email;
            }
        }
    }
});

export const {setCurrentUser } = userSlice.actions;

export default userSlice.reducer;