// Tạm thời dùng mảng users lưu dữ liệu
let users = [];

// GET /api/users
exports.getUsers = (req, res) => {
  res.json(users);
};

// POST /api/users
exports.createUser = (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: Date.now(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
};
