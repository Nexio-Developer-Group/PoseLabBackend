const jwt = require("jsonwebtoken");
const firebaseAuth = require("../services/firebaseAuth");
const User = require("../models/user");

const LOGIN_TYPE = {
  GOOGLE: 1,
  GITHUB: 2,
  PHONE: 3,
  EMAIL: 4
};

exports.auth = async (req, res) => {
  const { login_type_id, payload } = req.body;

  try {
    let decoded;

    /* ---------- AUTH ROUTING ---------- */
    if (
      login_type_id === LOGIN_TYPE.GOOGLE ||
      login_type_id === LOGIN_TYPE.GITHUB ||
      login_type_id === LOGIN_TYPE.PHONE
    ) {
      decoded = await firebaseAuth.verifyFirebaseToken(payload.id_token);
    } 
    else if (login_type_id === LOGIN_TYPE.EMAIL) {
        
      const user = await firebaseAuth.getOrCreateEmailUser(
        payload.email,
        payload.password
      );


      decoded = {
        uid: user.uid,
        email: user.email,
        firebase: { sign_in_provider: "password" }
      };
      
    } 
    else {
      return res.status(400).json({ error: "Invalid login type" });
    }

    
     /* ---------- USER UPSERT ---------- */
    let user = await User.findByUID(decoded.uid);
 
    if (!user) {
      user = await User.createUser({
        uid: decoded.uid,
        email: decoded.email || null,
        phone: decoded.phone_number || null,
        provider: decoded.firebase?.sign_in_provider,
        createdAt: new Date()
      });
    }

    const token = jwt.sign(
      {
        uid: user.uid,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user
    });

  } catch (err) {
    res.status(401).json({ error: "Authentication failed", details: err.message });
  }
};
