 const User= require("../models/User") 
 const bcrypt=require("bcryptjs");
 const jwt=require("jsonwebtoken");
 exports.register= async(req,res)=>{
  try{
    const{email,password}=req.body;
    const existuser=await User.findOne({email});
    if(existuser){
      return res.json({message:"user alreadyexist"});
    }
    const hashedpassword=await bcrypt.hash(password,10);
    const newuser=new User({
      email,
      password:hashedpassword,
    });
    await newuser.save();
    res.json({message:"user created successfully"});
  }
  catch(err){
    res.json({error:err.message})
  }
 }
 exports.login=async(req,res)=>{
  try{
const{email,password}=req.body;
const user =await User.findOne({email});
if(!user){
 return res.json({message:"user is not found"});
}
const isMatch=await bcrypt.compare(password,user.password);
  
  if(!isMatch){
    return res.json({message:"invalid credentials"});
  }
  const token = jwt.sign({ id: user.id }, "secretkey", {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token });
  }
   catch(err) {
    res.json({ error: err.message });
  }
  

 }

