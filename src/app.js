const express = require("express");
const connectDb=require("./config/database");
const app = express();
const cookieParser=require("cookie-parser");


app.use(express.json());
app.use(cookieParser());

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDb().then(()=>{
  console.log("connected to db");
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
  }).catch((err)=>{
    console.error(err);
});



