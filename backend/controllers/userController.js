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

// PUT /users/:id - Sửa user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id == id);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// DELETE /users/:id - Xóa user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const initialLength = users.length;
  users = users.filter(u => u.id != id);
  
  if (users.length < initialLength) {
    res.json({ message: "User deleted" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
