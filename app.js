const express = require("express");
const cookieParser = require("cookie-parser");
require("./firebase"); // initialize firebase

const app = express();

app.use(express.json());
app.use(cookieParser());

/* -------- Health Check -------- */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend connected to Firebase & Firestore"
  });
});

/* -------- Test Firestore Write -------- */
app.post("/test-write", async (req, res) => {
  const { db } = require("./firebase");

  try {
    const docRef = await db.collection("test").add({
      message: "Hello Firestore",
      createdAt: new Date()
    });

    res.json({
      success: true,
      docId: docRef.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
