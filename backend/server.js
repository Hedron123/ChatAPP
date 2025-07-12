const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // ✅ for static file serving
const { Server } = require("socket.io");

dotenv.config();

// Routes and Middleware
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { protect } = require("./middleware/authMiddleware");

const app = express(); // ✅ Define app before using it
const server = http.createServer(app);

// 👇 This must come AFTER app is declared
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ Fix is here

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => {
  console.error("❌ MongoDB connection failed", err);
  process.exit(1);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", protect, messageRoutes);
app.use("/api/chats", protect, chatRoutes);

// Root
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 New socket connection:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    const { content, sender, room, file } = data;
    io.to(room).emit("receive_message", { content, sender, file });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
