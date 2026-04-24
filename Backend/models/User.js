const mongoose=require("mongoose");
const userschema=new mongoose.Schema({
  email:{
type:String,
required:true,
unique:true
  },
  password:{
    type:String,
    },
    otp:String,
    otpExpiry:Date

  },{timestamps:true});
module.exports=mongoose.model("User",userschema);
