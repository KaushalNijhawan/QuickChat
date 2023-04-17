import express from "express";
import { User } from "../Datastore/UserModel/UserModel";
import { addUserDetails } from "./AuthenticationService";
const router = express.Router();


router.post("/login" , (req, res)=>{
    let response : User = req.body;
    res.status(200).send("Verified User!");    
});

router.post("/signUp" , (req, res)=>{
    let response : User = req.body;
    addUserDetails(response);
    res.status(200).send("Verified User!");
});

export default router;