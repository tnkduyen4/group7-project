// routes/admin.js
const express = require('express');
const router = express.Router();
const { auth, requireRole, requireSelfOrRole } = require('../middleware/authMiddleware');
const adminCtrl = require('../controllers/adminController');

// ADMIN: danh sách / tạo / sửa / xóa
router.get('/users',        auth, requireRole('admin'), adminCtrl.getAllUsers);
router.post('/users',       auth, requireRole('admin'), adminCtrl.createUser);
router.put('/users/:id',    auth, requireRole('admin'), adminCtrl.updateUser);
router.delete('/users/:id', auth, requireRole('admin'), adminCtrl.deleteUserById);

// (TUỲ CHỌN) Cho phép user tự xoá tài khoản của mình (giữ song song xóa của admin)
router.delete('/users/:id', auth, requireSelfOrRole('admin'), adminCtrl.deleteUserById);

module.exports = router;
