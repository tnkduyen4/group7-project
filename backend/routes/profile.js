const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET /profile - Lấy thông tin người dùng hiện tại
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT /profile - Cập nhật thông tin cá nhân
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true }
    ).select('-password');
    res.json({ message: 'Cập nhật thành công', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// === Upload avatar (Cloudinary + Multer) ===
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});
const upload = multer({ storage });

// POST /profile/avatar
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }

    // Sử dụng model User (không phải `user`) và req.user.id (không phải req.userId)
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { avatarUrl: req.file.path },
      { new: true }
    ).select('-password');

    res.json({ message: 'Upload avatar thành công', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi upload avatar', error: err.message });
  }
});

module.exports = router;
