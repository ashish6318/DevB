const express = require("express");
const connectDb=require("./config/database");
const app = express();
const cookieParser=require("cookie-parser");
const cors = require('cors');
require('dotenv').config();

app.use(
  cors({
    origin: "http://localhost:5173", // No trailing slash
    credentials: true,              // Allow credentials
  })
);
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
  app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
  });
  }).catch((err)=>{
    console.error(err);
});



