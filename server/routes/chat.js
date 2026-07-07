const express = require("express");
const Message = require("../models/message");
const router = express.Router();

// GET chat history between two users
router.get("/:userId/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    })
      .sort({ timestamp: 1 })
      .limit(200)
      .lean();

    // Map to frontend-friendly format
    const formatted = messages.map((msg) => ({
      _id: msg._id.toString(),
      text: msg.text,
      sender: msg.sender.toString() === userId ? "me" : "friend",
      timestamp: msg.timestamp,
    }));

    res.status(200).json({ messages: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
