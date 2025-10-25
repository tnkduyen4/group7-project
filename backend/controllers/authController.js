const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra thiếu dữ liệu
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Thiếu thông tin đăng ký' });
    }

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'Đăng ký thành công!' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi đăng ký' });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra có tồn tại email không
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });

    // Kiểm tra mật khẩu đúng không
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Đăng nhập thành công', token });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
  }
};

// Đăng xuất
exports.logout = async (req, res) => {
  res.json({ message: 'Đăng xuất thành công (xóa token phía client)' });
};