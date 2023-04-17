import express from "express";
import { User } from "../Datastore/UserModel/UserModel";
import { addUserDetails, verifyUserLogin } from "./AuthenticationService";
const router = express.Router();


router.post("/login" , async (req, res)=>{
    let request : User = req.body;
    let response = await verifyUserLogin(request.username , request.password);
    if(response){
        res.status(200).send("Verified User!");   
    }else{
        res.status(400).send("Invalid username or Password!");   
    }
     
});

router.post("/signUp" , async (req, res)=>{
    let request : User = req.body;
    const response : boolean = await addUserDetails(request);
    if(response){
        res.status(200).send("Verified User!");
    }else{
        res.status(400).send("Invalid Payload!");
    }
});

export default router;