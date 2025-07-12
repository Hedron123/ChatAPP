const express = require("express");
const { sendMessage, getMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, getMessages);
router.route("/").post(protect, upload.single("file"), sendMessage);

module.exports = router;
