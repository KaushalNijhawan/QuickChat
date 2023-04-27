import {Datastore} from "@google-cloud/datastore";
import { ChatUser } from "../UserModel/UserModel";
import { UUID, randomUUID } from "crypto";

let datastore = new Datastore({
    projectId: "superb-cycle-384321",
    keyFilename:"C:/Users/Kaushal Nijhawan/Downloads/superb-cycle.json"
});

export const addChats = async (chatUser: ChatUser) =>{
    if(chatUser.fromUsername && chatUser.toUsername && chatUser.messageContent){
        const childKey = datastore.key({
            path:["User" , chatUser.fromUsername.toLowerCase() , "Chat" , randomUUID().toString()]
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
        }
    }
}  


export const getChats = async () : Promise<any>=>{
    const query = datastore.createQuery("Chat");
        let [response]  = await datastore.runQuery(query);
        if(response && response.length > 0 ){
            let chatList : ChatUser[] = [];
            response.map((res)=>{
                if(res && res.fromUsername && res.toUsername && res.messageContent){
                    chatList.push({
                        fromUsername : res.fromUsername,
                        toUsername : res.toUsername,
                        messageContent : res.messageContent,
                        timestamp : res.timeStamp,
                        Id: res.Id
                    });
                }
            });

            return chatList;
        }
    return null;
}