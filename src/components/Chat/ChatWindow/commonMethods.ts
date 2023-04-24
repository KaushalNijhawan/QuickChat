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