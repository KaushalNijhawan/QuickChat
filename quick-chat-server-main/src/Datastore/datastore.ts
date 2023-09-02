import {Datastore} from "@google-cloud/datastore";
import { ChatUser, GroupChat, groupChatMessage } from "../UserModel/UserModel";
import { UUID, randomUUID } from "crypto";
import { Namespace } from "socket.io";
import { CREDENTIALS_PATH, PROJECT_ID } from "../Constants/Constants";

let datastore = new Datastore({
    projectId: PROJECT_ID,
    keyFilename: CREDENTIALS_PATH
});

export const addChats = async (chatUser: ChatUser) =>{
    if(chatUser.fromUsername && chatUser.toUsername && (chatUser.messageContent || chatUser.specialMessage)){
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
            return err;
        }
    }
}  


export const getChats = async () : Promise<any>=>{
    const query = datastore.createQuery("Chat");
        let [response]  = await datastore.runQuery(query);
        if(response && response.length > 0 ){
            let chatList : ChatUser[] = [];
            response.map((res)=>{
                if(res && res.fromUsername && res.toUsername ){
                    chatList.push({
                        fromUsername : res.fromUsername,
                        toUsername : res.toUsername,
                        messageContent : res.messageContent,
                        timestamp : res.timeStamp,
                        Id: res.Id,
                        type : res.type,
                        specialMessage : res.specialMessage
                    });
                }
            });

            return chatList;
        }
    return null;
}

export const addGroup = async (groupObj  : GroupChat) : Promise<string>=>{
    if(groupObj.usernames && groupObj.groupTitle){
        
        const key = datastore.key({path : ["Group", randomUUID().toString()] , namespace : "GroupChat"});
        const task = {
            key : key, 
            data: groupObj
        };
        try{
            await datastore.save(task);
            return "saved";
        }catch(err){
            console.log(err);
        }
    }

    return "Unsaved";
}

export const saveGroupChat = async (groupChatMessage : groupChatMessage) =>{
    if(groupChatMessage && groupChatMessage.fromUsername && groupChatMessage.groupTitle && groupChatMessage){
        const key = datastore.key({
            path:["GroupMessage" , randomUUID().toString()], 
            namespace : "GroupChats"
        });
        const childEntity = {
            key : key,
            data: groupChatMessage,
        };
        try{
            await datastore.save(childEntity);
            return "saved";
        }catch(err){
            console.log(err);
        }
    }
}

export const getGroups = async () : Promise<GroupChat[]> =>{
    const query =  datastore.createQuery( "GroupChat", "Group");

    let [response] = await datastore.runQuery(query);
    if(response && response.length  > 0 ){
        
        let groupList : GroupChat[] = [];
        response.map((res)=>{
            if(res.usernames && res.groupTitle){
                groupList.push({
                    usernames : res.usernames,
                    groupTitle : res.groupTitle
                });
            }
        });
        return groupList;
    }

    return [];
}

export const getChatsGroupSpecific = async (username : string , groupTitle : string)  : Promise<groupChatMessage[]>=>{
    if(username && groupTitle){
        const query = datastore.createQuery("GroupChats" , "GroupMessage").filter("groupTitle" , "=" , groupTitle);

        let [response] = await datastore.runQuery(query);
        if(response && response.length > 0 ){
            let groupChatList :  groupChatMessage[] = [];

            response.map((res)=>{
                if(res && res.toUsernames && res.groupTitle && res.fromUsername && res.timestamp && res.messageContent 
                    && res.Id){
                        groupChatList.push({
                            fromUsername : res.fromUsername ,
                            toUsernames : res.toUsernames,
                            timestamp : res.timestamp,
                            Id : res.Id,
                            groupTitle : res.groupTitle,
                            messageContent : res.messageContent,
                            type:  res.type,
                            specialMessage : res.specialMessage
                        });
                    }
            })
            return groupChatList;
        }
    }

    return [];
}