import axios from "axios";
import {verify} from "jsonwebtoken"; 

export const verifyToken =  (token: string, username: string, email: string) : Boolean => {
    if(token && username && email){
        try{
            const secretKey = username+","+email;
            let response  =  verify(token,secretKey);
            return true;
        }catch(err){
             console.log(err);
        }
    }
    return false;
}