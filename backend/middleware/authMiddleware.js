// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Xác thực JWT
exports.auth = (req, res, next) => {
  const raw = req.header('Authorization') || '';
  let token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
  if (!token) token = req.query?.token || req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Không có token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.userId || decoded.id || decoded._id;
    req.userRole = decoded.role || 'user';
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ message: 'Token hết hạn' });
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// Phân quyền theo role
exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.userRole || !roles.includes(req.userRole))
    return res.status(403).json({ message: 'Không đủ quyền' });
  return next();
};

// (Tuỳ chọn) Cho phép admin hoặc chính chủ
exports.requireSelfOrRole = (role = 'admin') => (req, res, next) => {
  const targetId = req.params.id;
  if (req.userRole === role) return next();
  if (targetId && String(targetId) === String(req.userId)) return next();
  return res.status(403).json({ message: 'Không đủ quyền' });
};