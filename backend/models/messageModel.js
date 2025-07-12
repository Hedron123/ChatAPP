const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    isRead: { type: Boolean, default: false },
    file: {
      filename: String,
      mimetype: String,
      url: String,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Message", messageSchema);
