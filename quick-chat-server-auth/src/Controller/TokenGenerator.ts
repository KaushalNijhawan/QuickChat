import { User } from "../Datastore/UserModel/UserModel";
import {sign, verify} from "jsonwebtoken";
export const tokenGenerator = (user : User) : string =>{
    if(user && user.username && user.password){
        let token = sign({foo : user.username + "," + user.password, exp: Math.floor(Date.now() / 1000) + (60 * 60)} , user.username );

        return token;
    }

    return "";
}

export const tokenVerify = (token : string, username : string , password : string)=>{
    if(token && username && password){
       let response: Boolean =  verify(token,username+"," + password ).match();

       return response;
    }
    return false;
}

export const checkTokenExpiry = () =>{

}