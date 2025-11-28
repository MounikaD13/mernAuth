const express=require("express")
const router=express.Router()
const authMiddleware = require("../middelware/authMiddleware")

router.get("/dashboard",authMiddleware,(req,res)=>{
    res.json({"message":"welcome to the website",user:req.user})
})
module.exports=router