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
        }
    }
});