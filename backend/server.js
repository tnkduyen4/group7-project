// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ====== KẾT NỐI MONGODB ATLAS ======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB Atlas thành công!'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// ====== IMPORT ROUTES ======
const userRoutes = require('./routes/user');

// ====== MIDDLEWARE ======
app.use(cors());           // Cho phép React frontend gọi API
app.use(express.json());   // Cho phép server đọc JSON từ body

// ====== ROUTES ======
app.use('/', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to User Management API' });
});

// ====== KHỞI ĐỘNG SERVER ======
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
