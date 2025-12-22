const express = require("express");
const authRoutes = require("./routes/auth");
require("./firebase"); // initialize firebase

const app = express();

app.use(express.json());
app.use("/api", authRoutes); 

module.exports = app;
