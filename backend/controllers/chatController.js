const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// ✅ Create chat using another user's email
const createChatByEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, targetUser._id] },
    });

    if (existingChat) return res.json(existingChat);

    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, targetUser._id],
    });

    const fullChat = await Chat.findById(newChat._id)
      .populate("users", "-password");

    res.status(201).json(fullChat);
  } catch (error) {
    res.status(500).json({ message: "Error creating chat" });
  }
};

// ✅ Dummy placeholders (replace with your real logic)
const accessChat = async (req, res) => {
  res.json({ msg: "accessChat not implemented" });
};

const getChats = async (req, res) => {
  res.json({ msg: "getChats not implemented" });
};

const createGroupChat = async (req, res) => {
  res.json({ msg: "createGroupChat not implemented" });
};

// ✅ Export all
module.exports = {
  createChatByEmail,
  accessChat,
  getChats,
  createGroupChat,
};
