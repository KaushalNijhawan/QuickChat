import axios from "axios"
import { ChatUser, GroupChat, GroupChatMessage, User } from "../../Model and Interfaces/Models";
import { store } from "../../Redux/store";
import { Constants } from "../../../Constants/Constants";
import { useDispatch } from "react-redux";
import { appendChat } from "../../Redux/ChatsRedux";
import { groupChatSlice } from "../../Redux/GroupChats";
export const getChats = async (): Promise<ChatUser[]> => {
    if (store && store.getState() && store.getState().user.token) {
        try {
            let response = await axios.get(`http://${Constants.CHAT_MAIN_IP}:3001/token/chats`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.getState().user.token}`
                }
            });

            return response.data;
        } catch (err) {
            console.log(err);
        }
    }
    return [];
}

export const provideClassPlacement = (chatObj: ChatUser, toUsername: string): string => {
    if (chatObj && toUsername && store.getState().user.username) {
        if (chatObj.fromUsername === store.getState().user.username && toUsername == chatObj.toUsername) {
            return "d-flex justify-content-end";
        } else if (chatObj.fromUsername === toUsername && store.getState().user.username == chatObj.toUsername) {
            return "d-flex justify-content-start";
        } else {
            return "";
        }
    }

    return "";
}

export const provideClassPlacementGroup = (chatObj: GroupChatMessage, toUsername: string): string => {
    if (chatObj && toUsername && store.getState().user.username) {
        if (chatObj.fromUsername === store.getState().user.username) {
            return "d-flex justify-content-end";
        } else {
            return "d-flex justify-content-start";
        }
    }

    return "";
}

export const provideTextHighlightGroup = (chatObj: GroupChatMessage, toUsername: string): string => {
    if (chatObj && toUsername && store.getState().user.username) {
        if (chatObj.fromUsername === store.getState().user.username) {
            return "bg-secondary text-white p-2 rounded";
        } else {
            return "bg-primary text-white p-2 rounded";
        }
    }
    return "";
}

export const provideTextHighlight = (chatObj: ChatUser, toUsername: string): string => {
    if (chatObj && toUsername && store.getState().user.username) {
        if (chatObj.fromUsername === store.getState().user.username && toUsername == chatObj.toUsername) {
            return "bg-secondary text-white p-2 rounded";
        } else if (chatObj.fromUsername === toUsername && store.getState().user.username == chatObj.toUsername) {
            return "bg-primary text-white p-2 rounded";
        } else {
            return "";
        }
    }
    return "";
}

export const getUsersRegistered = async (username: string, email: string, token: string): Promise<User[]> => {
    if (username && token && email) {
        try {
            let response = await axios.post(`http://${Constants.CHAT_AUTH_IP}:3000/auth/users`, {
                username: username,
                email: email
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }
    return [];
}

export const getGroupList = async (): Promise<GroupChat[]> => {
    try {
        let response = await axios.get(`http://${Constants.CHAT_MAIN_IP}:3001/token/groups`, {
            headers: {
                Authorization: `Bearer ${store.getState().user.token}`,
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (err) {
        console.log(err);
    }
    return [];
}

export const filterGroups = (groupChatList: GroupChat[], username: string): GroupChat[] => {
    let groupList: GroupChat[] = [];
    if (groupChatList && username) {
        groupChatList.map((group) => {
            if (group.usernames.includes(username)) {
                groupList.push(group);
            }
        });
    }
    return groupList;
}

export const getGroupChats = async (username: string, groupTitle: string): Promise<GroupChatMessage[]> => {
    if (username && groupTitle) {
        try {
            let response = await axios.post(`http://${Constants.CHAT_MAIN_IP}:3001/token/groupChats`, {
                username: username,
                groupTitle: groupTitle
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${store.getState().user.token}`
                }
            });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }
    return [];
}

export const uploadFileGroup = async (fromUsername: string,toUsernames: string[], ID : number , groupTitle : string , file : File, type: string, filename : string) =>{
    try{
        const formData = new FormData();
        formData.append('fromUsername' , fromUsername);
        formData.append('Id' , ID.toString());
        formData.append('groupTitle' , groupTitle);
        formData.append('toUsernames' , toUsernames.toString());
        formData.append('file' , file);
        formData.append('type', type);
        formData.append('filename', filename);
        let response = await axios.post(`http://${Constants.CHAT_MAIN_IP}:3001/token/upload/group`, formData);
        if(response && response.data){
            let groupChat : GroupChatMessage = {
                fromUsername : fromUsername,
                groupTitle : groupTitle ,
                Id : ID,
                messageContent : "",
                specialMessage : {
                    isDownloaded : true,
                    specialMessagelink : response.data.specialMessage.specialMessagelink,
                    messageVideoBuffer : null
                },
                timestamp : new Date().valueOf(),
                type : type,
                toUsernames : toUsernames
            }

            return groupChat;
        }

    }catch(err){
        console.log(err);
    }
}

export const uploadFilePrivate = async (fromUsername: string,toUsername: string, ID : number , file  : File, type : string , filename : string) : Promise<any> =>{
    try{
        const formData = new FormData();
        formData.append('fromUsername' , fromUsername);
        formData.append('toUsername' , toUsername);
        formData.append('ID' , ID.toString());
        formData.append('file', file);
        formData.append('type', type);
        formData.append('filename' , filename);

        let response = await axios.post(`http://${Constants.CHAT_MAIN_IP}:3001/token/upload/private`, formData, {
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response)
        if(response && response.data){
            let privateChat : ChatUser = {
                fromUsername: fromUsername,
                toUsername : toUsername,
                Id : ID,
                messageContent : "",
                specialMessage : {
                    isDownloaded : true,
                    specialMessagelink : response.data.specialMessage.specialMessagelink,
                    messageVideoBuffer : null
                },
                timestamp : new Date().valueOf(),
                type : type
            }
            return privateChat;
        }
        console.log(response);
    }catch(err){
        console.log(err);    
    }

    return null;
}