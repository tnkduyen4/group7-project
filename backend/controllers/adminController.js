// controllers/adminController.js
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.deleteUserById = async (req, res) => {
  const { id } = req.params;
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'User không tồn tại' });
  res.json({ message: 'Xóa thành công' });
};