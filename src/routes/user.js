const express=require("express");
const userAuth = require("../middlewares/auth");
const userRouter=express.Router();
const ConnectionRequest=require("../models/connectionRequests");
const User=require("../models/user");

const USER_SAFE_DATA="firstName lastName age gender photoUrl about skills";

//get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
  try{
const loggedInUser=req.user;
const connectionRequests=await ConnectionRequest.find({
  toUserId:loggedInUser._id,
  status:"interested"
}).populate("fromUserId",USER_SAFE_DATA);
res.json({
  message:"Data fetched Successfully",
  data:connectionRequests,
});

  }catch(err){
    res.status(500).json({message:"ERROR"+err.message});
  }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
  try{
    const loggedInUser=req.user;

    const connectionRequests=await ConnectionRequest.find({
      $or:[
        {fromUserId:loggedInUser._id,status:"accepted"},
        {toUserId:loggedInUser._id,status:"accepted"},
      ],
    }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

    const data=connectionRequests.map((row)=>{
      if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
        return row.toUserId;
      }
      return row.fromUserId;
    });


    res.json({data});
  }
  catch(err){
    res.status(500).json({message:"ERROR"+err.message});
  }
});

/*
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    const hideUserFromFeed=new Set();
    connectionRequests.forEach((req)=>{
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    

    const users=await User.find({
      $and: [
        { _id: { $nin: hideUserFromFeed } },
        {_id:  {$ne:loggedInUser._id} },
      ]
    });
console.log(users);

    if (!connectionRequests || connectionRequests.length === 0) {
      return res.status(404).json({ message: "No connection requests found" });
    }

    res.send(users);
  } catch (err) {
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});
*/
/*
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page=parseInt(req.query.page) || 1;
    let limit=parseInt(req.query.limit) ||10;
    limit=limit>50 ? 50:limit;
    const skip=(page-1)*limit;

    // Fetch connection requests
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    // Determine users to exclude from the feed
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    // Fetch users to show in the feed
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    // Respond with the users
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});*/
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Fetch connection requests
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    // Determine users to exclude from the feed
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    // Fetch users to show in the feed
    const users = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed), $ne: loggedInUser._id }
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    console.log("Users being sent to frontend:", users); // Debugging

    res.json({ users }); // ✅ Ensure response contains users array
  } catch (err) {
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});






module.exports=userRouter;
