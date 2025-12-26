const express = require("express");
const router = express.Router();
const { auth, signUp } = require("../controllers/auth");

router.post("/auth", auth);
router.post("/signup", signUp);
// curl -X POST http://localhost:3000/api/signup -H "Content-Type: application/json" -d '{"username":"testuser","email":"test@gmail.com","password":"Test@1234"}'
module.exports = router;
