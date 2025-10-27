// routes/admin.js
const express = require('express');
const router = express.Router();
const { auth, requireRole, requireSelfOrRole } = require('../middleware/authMiddleware');
const adminCtrl = require('../controllers/adminController');

// Chỉ ADMIN mới xem danh sách & xóa user
router.get('/users', auth, requireRole('admin'), adminCtrl.getAllUsers);
router.delete('/users/:id', auth, requireRole('admin'), adminCtrl.deleteUserById);

// (Tuỳ chọn) Cho user tự xóa mình:
// router.delete('/users/:id', auth, requireSelfOrRole('admin'), adminCtrl.deleteUserById);

module.exports = router;