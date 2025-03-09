const express = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/authModel");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleWare/authHandler");

// Sign Up
authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password, age } = req.body; // Accept 'age' in request body

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Sign Up Error: User with same email already exists!");
      return res.status(400).json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      name,
      age,  // Save age to DB
    });

    user = await user.save();

    // Generate JWT token after saving the user
    const token = jwt.sign({ id: user._id }, "passwordKey");

    // Return the user data and token
    console.log("Sign Up Success: User created and token generated.");
    res.json({ token, ...user._doc });
  } catch (e) {
    console.log("Sign Up Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});


// Sign In
authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Sign In Error: User with this email does not exist!");
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      console.log("Sign In Error: Incorrect password.");
      return res.status(400).json({ msg: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    console.log("Sign In Success: User signed in and token generated.");
    res.json({ token, ...user._doc });
  } catch (e) {
    console.log("Sign In Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Check if token is valid
authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      console.log("Token Check: No token provided.");
      return res.json(false);
    }

    const verified = jwt.verify(token, "passwordKey");
    if (!verified) {
      console.log("Token Check: Token verification failed.");
      return res.json(false);
    }

    const user = await User.findById(verified.id);
    if (!user) {
      console.log("Token Check: User not found.");
      return res.json(false);
    }

    console.log("Token Check Success: Token is valid.");
    res.json(true);
  } catch (e) {
    console.log("Token Check Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Get user data
authRouter.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    console.log("User Data Success: User found.");
    res.json({ ...user._doc, token: req.token });
  } catch (e) {
    console.log("Get User Data Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});


module.exports = authRouter;
