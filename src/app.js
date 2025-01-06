const express = require("express");
const app = express();

app.get("/user",(req,res)=>{
  res.send({
    "name":"John",
    "age":30
  })
});

app.post("/user",async(req,res)=>{
  res.send("Data Successfully saved to the database")
});

app.delete("/user",(req,res)=>{
  res.send("User deleted successfully");
});

// Specific routes first


app.use("/test", (req, res) => {
  res.send("Hello World we are testing server");
});

// General route last


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
