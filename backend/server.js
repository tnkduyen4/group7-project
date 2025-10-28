const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 👈 Thêm dòng này
require('dotenv').config(); // Đọc file .env

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://group7-project-snowy.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép request không có origin (như Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ======= Kết nối MongoDB Atlas =======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ======= Import Routes =======
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth'); 
const profileRoutes = require('./routes/profile');

// ======= Sử dụng Routes =======
app.use('/', userRoutes);
app.use('/auth', authRoutes); 
app.use('/profile', profileRoutes);

// ======= Khởi động server =======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));