const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const router = express.Router();

const SALT_ROUNDS = 12;

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { firstname, email, password } = req.body;

    // ✅ 1. Validation
    if (!firstname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      });
    }

    // ✅ 2. Check existing email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ 3. Hash password and save user
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      firstname,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ 4. Create token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ 5. Send response
    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        _id: newUser._id,
        firstname: newUser.firstname,
        email: newUser.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // 2️⃣ Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2.5 Check if user signed up with Google (no password set)
    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({ message: "This account uses Google Sign-In. Please log in with Google." });
    }

    // 3️⃣ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4️⃣ Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Success
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// GOOGLE AUTH
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    // Verify the Google ID token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name, picture } = payload;

    // Check if user already exists by googleId or email
    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
    });

    if (user) {
      // If user exists by email but hasn't linked Google yet, link it
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
        if (user.authProvider === "local") {
          user.authProvider = "google"; // Upgrade to Google auth
        }
        await user.save();
      }
    } else {
      // Create a new user from Google data
      user = new User({
        firstname: given_name || email.split("@")[0],
        email: email.toLowerCase(),
        googleId,
        avatar: picture || "",
        authProvider: "google",
        // No password for Google users
      });
      await user.save();
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // ✅ Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
