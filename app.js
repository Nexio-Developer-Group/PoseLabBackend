const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
require("./firebase"); // initialize firebase

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/api", authRoutes); 

module.exports = app;
