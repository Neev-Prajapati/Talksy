require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ;

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let dbConnected = false;

app.get("/api/db-status", (req, res) => {
  res.json({ connected: dbConnected });
});



const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Welcome to Talksy 🚀" });
});

const User = require("./models/user");


// GET all users
app.get("/user", async (req, res) => {
  try {
    const users = await User.find();   // ✅ fetch all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create user
app.post("/user", async (req, res) => {
  try {
    const user = await User.create(req.body); // ✅ insert user
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
