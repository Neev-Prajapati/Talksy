const mongoose = require("mongoose");

// Step 1: Define schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Step 2: Create model
const User = mongoose.model("User", userSchema);

// Step 3: Export model
module.exports = User;
