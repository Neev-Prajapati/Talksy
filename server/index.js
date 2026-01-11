require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Welcome to Talksy 🚀" });
});

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

async function start() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set. Set it in your .env file.");
    process.exit(1);
  }

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    dbConnected = true;
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Talksy backend running on port ${PORT}`);
    });
  } catch (err) {
    dbConnected = false;
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

start();

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  try { await client.close(); } catch (e) {}
  process.exit(0);
});