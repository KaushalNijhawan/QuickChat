import { createSlice , PayloadAction} from '@reduxjs/toolkit';
interface User{
    username : string,
    email : string ,
    token: string
}
const initialState : User  = { 
    username : "",
    email : "",
    token : ""       
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        setCurrentUser:(state , action : any)=>{
            console.log(action);
            if(action && action.payload && action.payload.username && action.payload.email && action.payload.token){
                state.email = action.payload.email;
                state.token = action.payload.token;
                state.username = action.payload.username;
            }
        }
    }
});

export const {setCurrentUser } = userSlice.actions;

export default userSlice.reducer;