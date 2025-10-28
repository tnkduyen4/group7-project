// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const User = require('../models/User');

// ===== SendGrid Setup =====
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ===== Helpers =====
const signJwt = (u) =>
  jwt.sign(
    { userId: u._id, role: u.role, email: u.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

const normalizeEmail = (e) => (e || '').trim().toLowerCase();

// ===== Auth Controllers =====

// Đăng ký
exports.signup = async (req, res) => {
  try {
    let { name, email, password, role } = req.body || {};
    email = normalizeEmail(email);

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      role: role === 'admin' ? 'admin' : 'user',
    });

    return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server khi đăng ký', error: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body || {};
    email = normalizeEmail(email);

    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

    const token = signJwt(u);

    return res.json({
      message: 'Đăng nhập thành công',
      token,
      role: u.role,
      name: u.name,
      email: u.email,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server khi đăng nhập', error: err.message });
  }
};

// Đăng xuất (client tự xoá token)
exports.logout = async (_req, res) => {
  return res.json({ message: 'Đã đăng xuất' });
};

// Quên mật khẩu: tạo token reset, gửi email Mailtrap
exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body || {};
    email = normalizeEmail(email);
    if (!email) return res.status(400).json({ message: 'Thiếu email' });

    const user = await User.findOne({ email });
    if (!user) {
      // Không tiết lộ tồn tại hay không – vẫn trả OK
      return res.json({ message: 'Nếu email hợp lệ, token đã được gửi' });
    }
// tạo token ngẫu nhiên và lưu hash vào DB
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();

    // Link reset (frontend có thể làm 1 trang /reset?token=...)
    // Ưu tiên CLIENT_URL từ env (Render/Vercel). Nếu thiếu, lấy từ Origin/Referer của request.
    let clientBase = process.env.CLIENT_URL;
    if (!clientBase) {
      const o = req.headers.origin || req.headers.referer;
      try {
        if (o) clientBase = new URL(o).origin;
      } catch (_) {
        // ignore parse errors
      }
    }
    if (!clientBase) clientBase = 'http://localhost:3001';
    const resetLink = `${clientBase}/reset?token=${rawToken}`;

    await sgMail.send({
      to: email,
      from: process.env.MAIL_FROM || 'no-reply@example.com',
      subject: 'Đặt lại mật khẩu',
      html: `
        <p>Xin chào ${user.name},</p>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào liên kết bên dưới (hết hạn trong 15 phút):</p>
        <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
        <p>Nếu không phải bạn, hãy bỏ qua email này.</p>
      `,
    });

    return res.json({ message: 'Đã gửi email đặt lại mật khẩu' });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server khi gửi reset', error: err.message });
  }
};

// Đổi mật khẩu bằng token reset
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) {
      return res.status(400).json({ message: 'Thiếu token hoặc mật khẩu mới' });
    }

    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() }, // còn hạn
    });

    if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server khi reset', error: err.message });
  }
};