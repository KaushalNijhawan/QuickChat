import express from "express";
import { getChats } from "../Datastore/datastore";

const router = express.Router();

router.get("/chats" , async(req, res)=>{
    let response : any = null;
    try{
        const token = req.headers['authorization'];
        response = await getChats();
    }catch(err){
        console.log(err);
    }
    if(response){
        res.status(200).send(response);
    }else{
        res.status(400).send("Invalid  payload!");
    }
});
export default router;