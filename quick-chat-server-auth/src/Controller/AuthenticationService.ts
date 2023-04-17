import bcrypt from "bcrypt";
import { User } from "../Datastore/UserModel/UserModel";
import { addUser, checkUser, fetchUser } from "../Datastore/datastore";

export const verifyUserLogin  = async (username : string , password : string) : Promise<Boolean>=>{
    if(username && password){
        const user = await fetchUser(username , password);
        if(user && user.password){
            let passwordEncoded = user.password;
            let checkMatch : boolean = await bcrypt.compare(password , passwordEncoded);
            if(checkMatch){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    return false;
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
