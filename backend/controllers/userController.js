// Mảng tạm lưu users (chưa dùng database)
let users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com' },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com' }
];

// GET /users - Lấy danh sách người dùng
exports.getUsers = (req, res) => {
  res.json(users);
};

// POST /users - Thêm người dùng mới
exports.createUser = (req, res) => {
  const { name, email } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Thiếu thông tin người dùng' });
  }

  // Tạo user mới với ID tự động tăng
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
};
