// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // React
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== Seed admin (chạy 1 lần nếu chưa có) =====
const bcrypt = require('bcryptjs');
const User = require('./models/User');
(async () => {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@demo.com';
    const pass  = process.env.ADMIN_PASS  || 'Admin@123';
    const has = await User.findOne({ email });
    if (!has) {
      const hash = await bcrypt.hash(pass, 10);
      await User.create({ name: 'Admin', email, password: hash, role: 'admin' });
      console.log('✅ Seeded admin:', email);
    }
  } catch (e) {
    console.log('⚠️ Seed admin error:', e.message);
  }
})();

// Routes
const authRoutes  = require('./routes/auth');
const adminRoutes = require('./routes/admin');
// (Nếu còn legacy userRoutes GET /users công khai → tạm bỏ hoặc mount sau)
try {
  const userRoutes = require('./routes/user'); // nếu có
  app.use('/', adminRoutes);   // ƯU TIÊN ADMIN (bảo vệ /users)
  app.use('/auth', authRoutes);
  app.use('/', userRoutes);    // legacy (nếu còn), có thể gây trùng route
} catch {
  app.use('/', adminRoutes);
  app.use('/auth', authRoutes);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));