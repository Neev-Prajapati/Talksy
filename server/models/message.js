const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional — not used for group messages
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: false, // Optional — only set for group messages
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient direct chat history queries
messageSchema.index({ sender: 1, receiver: 1, timestamp: 1 });

// Index for efficient group chat history queries
messageSchema.index({ group: 1, timestamp: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

