const mongoose=require("mongoose")
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    gender:String,
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobileNumber:Number,
    address:{
        type:String,
        required:true
    },
})
module.exports=mongoose.model("registerData",userSchema)