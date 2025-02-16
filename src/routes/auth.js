const express=require("express");
const authRouter =express.Router();
const {validateSignupData} = require("../utils/validation");
const User=require("../models/user");
const bcrypt=require("bcrypt");


authRouter.post("/signup",async(req,res)=>{
try{
//validation of data
validateSignupData(req);
const {firstName,lastName,emailId,password}=req.body;
//encrypt the password
const passwordHash=await bcrypt.hash(password,10);
console.log(passwordHash);

const user=new User({
firstName,
lastName,
emailId,
password:passwordHash,
});
 
  const savedUser=await user.save();
  const token=await savedUser.getJWT(); 

res.cookie("token",token,{
    expires:new Date(Date.now()+24*3600000),
});

  res.json({
    message:"User added Successfully",data:savedUser
  });
  } catch(err){
    res.status(400).send("ERROR:"+err.message);
  }
});

authRouter.post("/login",async(req,res)=>{
  try{
 const{emailId,password}=req.body;

 const user=await User.findOne({emailId:emailId});
 if(!user){
  throw new Error("EmailId is not present in DB");
 }

 const isPasswordValid=await user.validatePassword(password);

 if(isPasswordValid){
//create a jwt token
const token=await user.getJWT(); 

res.cookie("token",token,{
    expires:new Date(Date.now()+24*3600000),
});

  res.send(user);
 }
 else{
  throw new Error("Invalid password");
 }
}catch(err){
    res.status(400).send("ERROR: "+err.message);
}
});

authRouter.post("/logout",async(req,res)=>{
 res.cookie("token",null,{
  expires:new Date(Date.now())
 });
 res.send("logout successful !!");
});


module.exports=authRouter;
