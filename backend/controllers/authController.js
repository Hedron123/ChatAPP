// backend/controllers/authController.js
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ msg: "User already exists" });

  const user = await User.create({ name, email, password });
  res.status(201).json({ user, token: generateToken(user._id) });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ msg: "Invalid credentials" });

  res.json({ user, token: generateToken(user._id) });
};
