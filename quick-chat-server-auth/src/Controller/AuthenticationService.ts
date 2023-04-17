import bcrypt from "bcrypt";
import { User } from "../Datastore/UserModel/UserModel";
import { addUser, checkUser } from "../Datastore/datastore";
export const verifyUserLogin  = (username : string , password : string) =>{
    if(username && password){

    }
}

export const addUserDetails = async (userObject : User): Promise<boolean> =>{
    if(userObject && userObject.email && userObject.password && userObject.username){
        const response: boolean = await checkUser(userObject);
        if(!response){
            return false;
        }else{
            let password = await bcrypt.hash(userObject.password , 10)
            userObject.password = password;
            const response = await  addUser(userObject);
            return true;
        }
        
    }
    return false;
}
