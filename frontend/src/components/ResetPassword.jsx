// src/components/ResetPassword.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ResetPassword({ presetToken = '', onBack }) {
  const [token, setToken] = useState(presetToken);
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  // if presetToken changes, keep it; if not provided, try to read from URL
  useEffect(() => {
    if (presetToken) {
      setToken(presetToken);
      console.log('[ResetPassword] using presetToken from props');
    } else {
      try {
        const q = new URLSearchParams(window.location.search);
        const t = q.get('token');
        if (t) {
          setToken(t);
          console.log('[ResetPassword] token taken from URL:', t);
        } else {
          console.log('[ResetPassword] no token in props or URL');
        }
      } catch (err) {
        console.warn('[ResetPassword] cannot parse URL token', err);
      }
    }
  }, [presetToken]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      console.log('[ResetPassword] submitting token:', token);
      const { data } = await axios.post('/auth/reset-password', { token, password });
      console.log('[ResetPassword] reset response:', data);
      setMsg(data.message || 'Đổi mật khẩu thành công. Hãy đăng nhập lại.');
    } catch (e) {
      console.error('[ResetPassword] submit error:', e?.response || e);
      setMsg(e?.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  return (
    <div>
      <h2 className="app-title">Đặt lại mật khẩu</h2>
      <form className="adduser-form" onSubmit={submit}>
        <input placeholder="Token từ email" value={token} onChange={e=>setToken(e.target.value)} />
        <input type="password" placeholder="Mật khẩu mới" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary" type="submit">Đổi mật khẩu</button>
        <button type="button" className="btn btn-outline" onClick={onBack} style={{marginLeft:8}}>Quay lại</button>
      </form>
      {msg && <p className="empty-message">{msg}</p>}
    </div>
  );
}
