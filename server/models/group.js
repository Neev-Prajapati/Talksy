const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String, // URL to group avatar image
    default: "",
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient lookups by member
groupSchema.index({ members: 1 });

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
