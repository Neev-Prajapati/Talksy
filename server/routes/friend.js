const express = require("express");
const User = require("../models/user");
const router = express.Router();

// SEARCH user by email (excludes self)
router.get("/search", async (req, res) => {
  try {
    const { email, userId } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "_id firstname email"
    );

    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    // Don't return self
    if (user._id.toString() === userId) {
      return res.status(400).json({ message: "You can't add yourself" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// SEND friend request
router.post("/request", async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ message: "Both from and to are required" });
    }

    if (from === to) {
      return res.status(400).json({ message: "You can't send a request to yourself" });
    }

    const sender = await User.findById(from);
    const receiver = await User.findById(to);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already friends
    if (sender.friends.includes(to)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Check if request already sent
    const existingRequest = receiver.friendRequests.find(
      (req) => req.from.toString() === from
    );
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Check if receiver already sent a request to sender (auto-accept)
    const reverseRequest = sender.friendRequests.find(
      (req) => req.from.toString() === to
    );
    if (reverseRequest) {
      // Auto-accept: both become friends
      sender.friends.push(to);
      receiver.friends.push(from);
      sender.friendRequests = sender.friendRequests.filter(
        (req) => req.from.toString() !== to
      );
      await sender.save();
      await receiver.save();
      return res.status(200).json({ message: "You are now friends! (mutual request)" });
    }

    // Add request to receiver
    receiver.friendRequests.push({ from, status: "pending" });
    await receiver.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET pending friend requests for a user
router.get("/requests/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "friendRequests.from",
      "_id firstname email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pending = user.friendRequests
      .filter((r) => r.status === "pending")
      .map((r) => ({
        _id: r.from._id,
        firstname: r.from.firstname,
        email: r.from.email,
      }));

    res.status(200).json({ requests: pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ACCEPT friend request
router.post("/accept", async (req, res) => {
  try {
    const { userId, requesterId } = req.body;

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the request
    user.friendRequests = user.friendRequests.filter(
      (r) => r.from.toString() !== requesterId
    );

    // Add each other as friends (if not already)
    if (!user.friends.includes(requesterId)) {
      user.friends.push(requesterId);
    }
    if (!requester.friends.includes(userId)) {
      requester.friends.push(userId);
    }

    await user.save();
    await requester.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// REJECT friend request
router.post("/reject", async (req, res) => {
  try {
    const { userId, requesterId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.friendRequests = user.friendRequests.filter(
      (r) => r.from.toString() !== requesterId
    );

    await user.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET friends list for a user
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "friends",
      "_id firstname email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = user.friends.map((f) => ({
      _id: f._id,
      name: f.firstname,
      email: f.email,
      online: false, // placeholder for now
    }));

    res.status(200).json({ friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
