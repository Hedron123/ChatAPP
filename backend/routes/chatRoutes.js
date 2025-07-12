const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  getChats,
  createGroupChat,
  createChatByEmail, // ✅ must match what you defined in controller
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, getChats);
router.post("/group", protect, createGroupChat);
router.post("/create", protect, createChatByEmail); // ✅ must be defined in controller

module.exports = router;
