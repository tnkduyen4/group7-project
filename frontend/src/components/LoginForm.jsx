// src/components/LoginForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import ForgotPassword from './ForgotPassword'; // added

// (Tùy chọn) đảm bảo baseURL nếu bạn chưa set trong App.js
if (!axios.defaults.baseURL) {
  axios.defaults.baseURL = 'http://localhost:3000';
}

function LoginForm({ setToken, onLogged }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showForgot, setShowForgot] = useState(false); // added

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    try {
      const { data } = await axios.post('/auth/login', formData);
      // Kỳ vọng backend trả về: { token, role, name, email }
      if (data?.token) {
        localStorage.setItem('token', data.token);
        if (data.role)  localStorage.setItem('role',  data.role);
        if (data.name)  localStorage.setItem('name',  data.name);
        if (data.email) localStorage.setItem('email', data.email);

        // gắn Authorization cho mọi request sau đó
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        // cập nhật state App
        setToken && setToken(data.token);
        onLogged && onLogged(data.role || 'user');
      } else {
        setMessage(data?.message || 'Sai email hoặc mật khẩu!');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Lỗi kết nối server!';
      setMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <h2 className="app-title">Đăng nhập</h2>

      <form className="adduser-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <input
            style={{ flex: 1 }}
            type={showPwd ? 'text' : 'password'}
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowPwd((s) => !s)}
            title={showPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPwd ? 'Ẩn' : 'Hiện'}
          </button>
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        {/* added forgot password button */}
        <button
          type="button"
          className="btn-link"
          onClick={() => setShowForgot(true)}
          style={{ marginTop: 8 }}
        >
          Quên mật khẩu?
        </button>
      </form>
{!!message && <p className="empty-message" style={{ marginTop: 8 }}>{message}</p>}

      {/* render ForgotPassword modal/component */}
      {showForgot && <ForgotPassword onClose={() => setShowForgot(false)} />}
    </div>
  );
}

export default LoginForm;