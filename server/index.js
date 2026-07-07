require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/message");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ===== MongoDB Connection =====
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

// ===== REST Routes =====
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

const friendRoutes = require("./routes/friend");
app.use("/api/friends", friendRoutes);

const chatRoutes = require("./routes/chat");
app.use("/api/chat", chatRoutes);

// ===== Socket.IO =====
// Track online users: { userId: socketId }
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // User joins with their userId
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online (socket: ${socket.id})`);
  });

  // Handle sending a message
  socket.on("send_message", async (data) => {
    const { senderId, receiverId, text } = data;

    try {
      // Save to database
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        text,
        timestamp: new Date(),
      });
      await message.save();

      const messageData = {
        _id: message._id.toString(),
        text: message.text,
        senderId: senderId,
        receiverId: receiverId,
        timestamp: message.timestamp,
      };

      // Send to receiver if online
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", messageData);
      }

      // Send confirmation back to sender
      socket.emit("message_sent", messageData);
    } catch (err) {
      console.error("Error saving message:", err);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    // Remove user from online map
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// ===== Start Server =====
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});