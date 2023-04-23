import express from "express";
import { getChats } from "../Datastore/datastore";

const router = express.Router();

router.post("/chats" , async(req, res)=>{
    let response : any = null;
    try{
        const requestObject = req.body;
        const token = req.headers['auuthorization'];
        console.log(token);
        response = await getChats(requestObject.fromUsername);
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