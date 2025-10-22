// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const userRoutes = require('./routes/user');

// Middleware
app.use(cors());           // Cho phép React frontend gọi API
app.use(express.json());   // Cho phép server đọc dữ liệu JSON từ body

// Routes
app.use('/', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to User Management API' });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});