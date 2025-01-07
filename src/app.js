const express = require("express");
const connectDb=require("./config/database");
const app = express();
const User=require("./models/user");

app.post("/signup",async(req,res)=>{
  const user=new User({
    firstName:"virat",
    lastName:"kohli",
    emailId:"viratkohli@gmail.com",
    password:"virat123"

  });
  try{
  await user.save();
  res.send("user added successfully");
  } catch(err){
    res.status(400).send(err);
  }
});

connectDb().then(()=>{
  console.log("connected to db");
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
  }).catch((err)=>{
    console.error(err);
})



