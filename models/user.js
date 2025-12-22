const { db } = require("../firebase");

const USERS_COLLECTION = "users";

exports.findByUID = async (uid) => {
  const doc = await db.collection(USERS_COLLECTION).doc(uid).get();
  return doc.exists ? doc.data() : null;
};

exports.createUser = async (user) => {
  await db.collection(USERS_COLLECTION).doc(user.uid).set(user);
  return user;
};
