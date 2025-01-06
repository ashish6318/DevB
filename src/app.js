const express = require("express");
const app = express();

// Specific routes first
app.use("/hello", (req, res) => {
  res.send("Hello World");
});

app.use("/test", (req, res) => {
  res.send("Hello World we are testing server");
});

// General route last
app.use("/", (req, res) => {
  res.send("Hello from dashboard");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
