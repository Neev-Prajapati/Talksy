const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Welcome to Talksy 🚀" });
});

app.listen(5000, () => {
  console.log("Talksy backend running on port 5000");
});
