import express from "express";
import { getChats, getChatsGroupSpecific, getGroups } from "../Datastore/datastore";
import { GroupChat, groupChatMessage } from "../UserModel/UserModel";

const router = express.Router();

router.get("/chats", async (req, res) => {
    let response: any = null;
    try {
        const token = req.headers['authorization'];
        response = await getChats();
    } catch (err) {
        console.log(err);
    }
    if (response) {
        res.status(200).send(response);
    } else {
        res.status(400).send("Invalid  payload!");
    }
});

router.get("/groups", async (req, res) => {
    let response: GroupChat[] = [];
    try {
        const token = req.headers["authorization"];
        response = await getGroups();
        console.log(response);
    } catch (err) {
        console.log(err);
    }
    if (response) {
        res.status(200).send(response);
    } else {
        res.status(400).send("Invalid Payload!");
    }
});

router.post("/groupChats" , async (req, res)=>{
    let request:{username : string , groupTitle : string} = req.body;
    let response: groupChatMessage[] = [];
    if(request.username && request.groupTitle){
        response  = await getChatsGroupSpecific(request.username, request.groupTitle);
    }
    if(response){
        res.status(200).send(response);
    }else{
        res.status(400).send("Invalid Payload");
    }
});
export default router;