import {Datastore} from "@google-cloud/datastore";
import { User } from "./UserModel/UserModel";
import { CommitResponse } from "@google-cloud/datastore/build/src/request";

let datastore = new Datastore({
    projectId: "upbeat-glow-381318",
    keyFilename:"C:/Practice Project/ATSE-2/QuickChat/quick-chat-server-auth/credentials/upbeat-glow.json"
});

export const addUser = async({username , password , email }:{username: string , password : string, email : string})=>{
     const taskKey = datastore.key({ namespace : "ChatUser" , path : ["User", username.toLowerCase()]});
    if(username && password && email ){
        const task = {
            key : taskKey, 
            data:{ 
                username : username ,
                password: password,
                email : email
            }
        }
       let response : CommitResponse = await datastore.save(task);
    
       return response;
    }

    return null;
  }

 export const checkUser = async (user : User): Promise<boolean> =>{
    if(user && user.username && user.email ){
        //    always mention the namespace and kind together inside the createQuery method arguments
          let query = datastore.createQuery("ChatUser", "User").filter("username" , "=" , user.username).limit(1);

          let [users] = await datastore.runQuery(query);
          if(users.length > 0 ){
            return false;
          }

          query  = datastore.createQuery("ChatUser", "User").filter("email" , "=" , user.email).limit(1);
          [users] = await datastore.runQuery(query);
          if(users.length > 0 ){
            return false;
          }
          return true;
    }
    return true;
 }  

