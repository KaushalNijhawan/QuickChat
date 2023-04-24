import axios from "axios"
import { ChatUser } from "../../Model and Interfaces/Models";
import { store } from "../../Redux/store";
export const getChats = async () : Promise<ChatUser[]>=>{
    if(store && store.getState() && store.getState().user.token){
        try{
           let response =  await axios.get("http://localhost:3001/token/chats" , {
                headers:{
                    Accept : "application/json",
                    "Content-Type":"application/json",
                    "Authorization" : `Bearer ${store.getState().user.token}`
                }
            });

            return response.data;
        }catch(err){
            console.log(err);
        }
    }
    return [];
}

export const provideClassPlacement = (chatObj : ChatUser , toUsername : string): string =>{
    if(chatObj  && toUsername && store.getState().user.username){
        if(chatObj.fromUsername === store.getState().user.username && toUsername == chatObj.toUsername){
            return "d-flex justify-content-end";
        }else if(chatObj.fromUsername === toUsername && store.getState().user.username == chatObj.toUsername){
            return "d-flex justify-content-start";
        }else{
            return "";
        }
    }

    return "";
}   

export const provideTextHighlight = (chatObj : ChatUser , toUsername : string): string =>{
    if(chatObj  && toUsername && store.getState().user.username){
        if(chatObj.fromUsername === store.getState().user.username && toUsername == chatObj.toUsername){
            return "bg-secondary text-white p-2 rounded";
        }else if(chatObj.fromUsername === toUsername && store.getState().user.username == chatObj.toUsername){
            return "bg-primary text-white p-2 rounded";
        }else{
            return "";
        }
    }
    return "";
}