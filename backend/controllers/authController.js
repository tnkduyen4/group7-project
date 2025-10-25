// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });

    const ex = await User.findOne({ email });
    if (ex) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hash, role: role || 'user' });
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi đăng ký', error: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

    const token = jwt.sign(
      { userId: u._id, role: u.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      role: u.role,
      name: u.name,
      email: u.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi đăng nhập', error: err.message });
  }
};

// Đăng xuất (client xoá token là đủ)
exports.logout = async (req, res) => {
  res.json({ message: 'Đã đăng xuất' });
};