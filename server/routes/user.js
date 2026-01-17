const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { firstname, email, password } = req.body;

    // ✅ 1. Validation
    if (!firstname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ 2. Check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    console.log(firstname,email,password)
    // ✅ 3. Save user
    const newUser = new User({
      firstname,
      email,
      password,
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

    // 2️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 3️⃣ Check password (plain text for now)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4️⃣ Success
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstname: user.firstname,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // ✅ await

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
