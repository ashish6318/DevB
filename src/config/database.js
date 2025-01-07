const mongoose=require("mongoose");


const connectDb=async()=>{
  await
  mongoose.connect("mongodb+srv://ashish09:NxTiTbDafpt5cc21@cluster0.eeigr.mongodb.net/DevTinder?retryWrites=true&w=majority&appName=Cluster0");
};

module.exports=connectDb;


