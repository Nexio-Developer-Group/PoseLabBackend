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

// sign up from username email and password
exports.signUpUser = async (username, email, password) => {
  try {
    const user = await admin.auth().createUser({ email, password });
    await admin.auth().setCustomUserClaims(user.uid, { username });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

