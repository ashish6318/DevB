const jwt=require("jsonwebtoken");
const User=require("../models/user");


  const userAuth=async(req,res,next)=>{
try{
  const {token}=req.cookies;
  if(!token){
    return res.status(401).json({error:"Please login to access this resource"});
  };

  const decodedObj=await jwt.verify(token,"@Ashish0904");
  const {_id}=decodedObj;

  const user=await User.findById(_id);
  if(!user){
    throw new Error("User not found");
  }
  req.user=user;
  next();
}
catch(err){
    res.status(401).send("ERROR: "+err.message);
  }
};

module.exports=userAuth;
