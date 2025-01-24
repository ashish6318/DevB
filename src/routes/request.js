const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();

const userAuth = require("../middlewares/auth");
const User=require("../models/user");
const ConnectionRequest = require("../models/connectionRequests");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
   
    //vaidate request
    const allowedStatus=["interested","ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type: "+status});
    }

    //if toUserId is present in DB then request sending should be possible
    const toUser=await User.findById(toUserId);
      if(!toUser){
        return res.status(404).json({ message: "User not found!" });
      }
      // user cannot send a connection request to themselves code written in connection request.js model

    //if there is an existing onnectionRequest
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if(existingRequest){
      return res
      .status(400)
      .json({ message: "You have already sent a request to this user." });
    }

    // Create a new connection request
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({
      message: `${req.user.firstName} is ${status} in ${toUser.firstName}.`,
      data,
    });    
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try {
const loggedInUser=req.user;
//validate status
const {status,requestId}=req.params;
const allowedStatus=["accepted","rejected"];
if (!allowedStatus.includes(status)) {
  return res.status(400).json({ message: "Invalid status type: "+status});
}
//check the user is logged in who got the request from user and status is interested
const connectionRequest=await ConnectionRequest.findOne({
  _id:requestId,
  toUserId:loggedInUser._id,
  status:"interested",
});
if(!connectionRequest){
  return res.status(404).json({ message: "Connection Request not found!"});
}
connectionRequest.status=status;
const data=await connectionRequest.save();
res.json({
  message: `${req.user.firstName} has ${status} your request.`,data
});

}
  catch(err){
    res.status(500).send("ERROR: " + err.message);
  }
});

module.exports = requestRouter;








// const express=require("express");
// const requestRouter=express.Router();

// const userAuth=require("../middlewares/auth");
// const ConnectionRequest=require("../models/connectionRequest");


// requestRouter.post("/request/send/interested/:toUserId",userAuth,async(req,res)=>{
//  try{
// const fromUserId=req.user._id;
// const toUserId=req.params.toUserId;
// const status="interested";

// const connectionRequest=new ConnectionRequest({
//   fromUserId,
//   toUserId,
//   status

// });
// const data=await connectionRequest.save();
// res.json({
//   message:"Connection Request sent Successfully",
//   data,
// })

//  }
//  catch(err){
//   res.status(500).send("ERROR: "+err.message);
//  }

//   res.send(user.firstName+ "sent the connection request");
// });

// module.exports=requestRouter;
