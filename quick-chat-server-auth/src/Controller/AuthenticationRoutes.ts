import express from "express";

const router = express.Router();


router.get("/login" , (req, res)=>{
    res.send("here inside the login route you are!");
});

router.get("/signUp" , (req, res)=>{

});
export default router;