import express from "express";
import { User } from "../Datastore/UserModel/UserModel";
import { addUserDetails } from "./AuthenticationService";
const router = express.Router();


router.post("/login" , (req, res)=>{
    let response : User = req.body;
    res.status(200).send("Verified User!");    
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