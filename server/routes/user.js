const express = require("express");
const router = express.Router();
const User = require("../models/user");

/* SIGNUP */
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  await User.create({ username, password });

  res.status(201).json({ message: "User created successfully" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});

// router.get("/", (req, res) => {
//   res.send("User route working");
// });

// router.get("/signup", (req, res) => {
//   res.send("Signup working");
// });

// router.get("/login", (req, res) => {
//   res.send("Login working");
// });

module.exports = router;
