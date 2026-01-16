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
    required: true
  }
});

// Step 2: Create model
const User = mongoose.model("User", userSchema);

// Step 3: Export model
module.exports = User;
