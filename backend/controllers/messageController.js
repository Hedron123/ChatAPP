const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content && !req.file) {
    return res.status(400).json({ msg: "Message or file is required" });
  }

  try {
    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };

    // Attach file data
    if (req.file) {
      newMessage.file = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
      };
    }

    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name email");
    message = await message.populate("chat");
    message = await Chat.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// @desc    Get all messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to get messages" });
  }
};
