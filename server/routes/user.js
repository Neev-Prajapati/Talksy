const express = require("express");
const User = require("../models/User");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    // ✅ 1. Extract firstname also
    const { firstname, email, password } = req.body;

    // ✅ 2. Validation
    if (!firstname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ 3. Check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ 4. Save user
    const newUser = new User({
      firstname,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
