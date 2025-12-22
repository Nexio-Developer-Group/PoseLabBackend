const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(
  __dirname,
  "firebase-service-account.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log("Firebase & Firestore connected");

module.exports = {
  admin,
  db
};
