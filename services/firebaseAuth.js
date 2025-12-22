const { admin } = require("../firebase");

exports.verifyFirebaseToken = async (idToken) => {
  return await admin.auth().verifyIdToken(idToken);
};

exports.getOrCreateEmailUser = async (email, password) => {
  try {
    return await admin.auth().getUserByEmail(email);
  } catch {
    return await admin.auth().createUser({ email, password });
  }
};
