const mongoose = require("mongoose");

const connectionRequestsSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",//reference to the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "Status must be either ignored, interested, accepted, or rejected",
      },
    },
  },
  { timestamps: true }
);

connectionRequestsSchema.index({fromUserId:1,toUserId:1});

connectionRequestsSchema.pre("save",function(next){
  const connectionRequest=this;
  //check if the fromUserId is same as toUserId
  if(connectionRequest.fromUserId.toString()===connectionRequest.toUserId.toString()){
    throw new Error("You cannot send a connection request to yourself"); 
  }
  next();
});

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestsSchema);

module.exports = ConnectionRequestModel;


