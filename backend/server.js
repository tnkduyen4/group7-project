const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Đọc file .env

const app = express();
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
  const users = await User.find();
  res.json(users);
});

// Thêm user mới
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const newUser = new User({ name, email });
  await newUser.save();
  res.json(newUser);
});

// ======= Khởi động server =======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
