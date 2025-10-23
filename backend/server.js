const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 👈 Thêm dòng này
require('dotenv').config(); // Đọc file .env

const app = express();

// 👇 Thêm CORS trước các route
app.use(cors({
  origin: 'http://localhost:3001', // Cho phép frontend React truy cập
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ======= Kết nối MongoDB Atlas =======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ======= Import Model =======
const User = require('./models/User');

// ======= Routes =======

// Lấy tất cả user
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách người dùng' });
  }
});

// Thêm user mới
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi thêm người dùng' });
  }
});

// ======= Khởi động server =======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
