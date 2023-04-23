import {Datastore} from "@google-cloud/datastore";
import { ChatUser } from "../UserModel/UserModel";

let datastore = new Datastore({
    projectId: "superb-cycle-384321",
    keyFilename:"C:/Users/Kaushal Nijhawan/Downloads/superb-cycle.json"
});

export const addChats = async (chatUser: ChatUser) =>{
    if(chatUser.fromUsername && chatUser.toUsername && chatUser.messageContent){
        const childKey = datastore.key({
            path:["User" , chatUser.fromUsername.toLowerCase() , "Chat" , chatUser.toUsername]
        });
        const parentKey = datastore.key({
            path: ["User" , chatUser.fromUsername.toLowerCase()]
        })
        const childEntity = {
            key : childKey,
            data:chatUser,
            parent: parentKey
        };
        try{
            await datastore.save(childEntity);
            return "saved";
        }catch(err){
            console.log(err);
        }
    }
}  


export const getChats = async (fromUsername : string) : Promise<any>=>{
    if(fromUsername){
        const query = datastore.createQuery("Chat").filter("fromUsername" , "=" , fromUsername);
        let response = await datastore.runQuery(query);
        console.log(response);
        return response;
    }
    return null;
}

