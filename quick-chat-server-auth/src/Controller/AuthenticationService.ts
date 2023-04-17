import bcrypt from "bcrypt";
import { User } from "../Datastore/UserModel/UserModel";
import { addUser } from "../Datastore/datastore";
export const verifyUserLogin  = (username : string , password : string) =>{
    if(username && password){

    }
}

export const addUserDetails = async (userObject : User) =>{
    if(userObject && userObject.email && userObject.password && userObject.username){
        let password = await bcrypt.hash(userObject.password , 10)
        userObject.password = password;
        const response = await  addUser(userObject);
        console.log(response);
    }
}
