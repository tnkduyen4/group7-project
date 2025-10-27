// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const { data } = await axios.post('/auth/forgot-password', { email });
      setMsg(data.message || 'Đã gửi email reset (kiểm tra Mailtrap).');
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Gửi email thất bại');
    }
  };

  return (
    <div>
      <h2 className="app-title">Quên mật khẩu</h2>
      <form className="adduser-form" onSubmit={submit}>
        <input type="email" placeholder="Nhập email đăng ký" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="btn btn-primary" type="submit">Gửi liên kết reset</button>
        <button type="button" className="btn btn-outline" onClick={onBack} style={{marginLeft:8}}>Quay lại</button>
      </form>
      {msg && <p className="empty-message">{msg}</p>}
    </div>
  );
}
