require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// const User = require("./models/user");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("MongoDB connected");
    app.get("/api/db-status", (req, res) => {
      res.json({ connected: true });
    });
  })
  .catch(err => {
    console.log("MongoDB connection error:", err);
    app.get("/api/db-status", (req, res) => {
      res.json({ connected: false });
    });
  });

const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});