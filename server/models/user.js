const mongoose = require("mongoose");

// Step 1: Define schema
const userSchema = new mongoose.Schema({
  firstname:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase:true
  },
  password: {
    type: String,
    required: false // Optional — Google users won't have a password
  },
  googleId: {
    type: String,
    required: false,
    sparse: true // Allow null but enforce uniqueness when present
  },
  avatar: {
    type: String, // Google profile picture URL
    default: ""
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  friendRequests: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: ["pending"],
      default: "pending"
    }
  }]
});

// Step 2: Create model
const User = mongoose.model("User", userSchema);

// Step 3: Export model
module.exports = User;
