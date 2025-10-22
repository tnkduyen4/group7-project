const express = require('express');
const router = express.Router();

let users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com' },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com' },
];

// Lấy danh sách người dùng
router.get('/users', (req, res) => {
  res.json(users);
});

// Thêm người dùng
router.post('/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = router;