const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    
    // Log token check
    if (!token) {
      console.log("Authorization Error: No auth token, access denied.");
      return res.status(401).json({ msg: "No auth token, access denied" });
    }

    // Verify the token
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) {
      console.log("Authorization Error: Token verification failed, authorization denied.");
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });
    }

    // Log successful token verification
    console.log("Authorization Success: Token verified and user authorized.");
    
    // Attach user ID and token to request object
    req.user = verified.id;
    req.token = token;
    next();
  } catch (err) {
    console.log("Authorization Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;
