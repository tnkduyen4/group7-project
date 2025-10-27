const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET /users - Lấy danh sách người dùng
exports.getUsers = async (req, res) => {
  try {
    // avoid returning passwords
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách người dùng' });
  }
};

// POST /users - Thêm người dùng mới
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Thiếu thông tin người dùng (name, email, password bắt buộc)' });
    }

    // hash password
    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hash });
    await newUser.save();

    // don't return password in response
    const obj = newUser.toObject();
    delete obj.password;

    res.status(201).json(obj);
  } catch (error) {
    // handle mongoose validation errors gracefully
    if (error && error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    console.error('[createUser] error:', error);
    res.status(500).json({ error: 'Lỗi server khi thêm người dùng' });
  }
};

// PUT /users/:id - Sửa user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi cập nhật người dùng' });
  }
};

// DELETE /users/:id - Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi xóa người dùng' });
  }
};
