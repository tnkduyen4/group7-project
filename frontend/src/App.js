// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import axios from 'axios';

// ===== axios defaults =====
axios.defaults.baseURL = 'http://localhost:3000';
const bootToken = localStorage.getItem('token');
if (bootToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${bootToken}`;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role,  setRole]  = useState(localStorage.getItem('role'));
  const [page,  setPage]  = useState('login');
  const [booting, setBooting] = useState(true);
  const [resetToken, setResetToken] = useState(''); // token reset từ URL

  // Lần đầu vào app: có token nhưng thiếu role -> gọi /profile để hydrate
  useEffect(() => {
    const hydrate = async () => {
      const t = localStorage.getItem('token');
      let r = localStorage.getItem('role');

      if (t) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
        if (!r) {
          try {
            const { data } = await axios.get('/profile');
            r = data?.role || 'user';
            localStorage.setItem('role', r);
          } catch {
            // token không hợp lệ -> xoá sạch
            localStorage.clear();
          }
        }
      }

      const finalToken = localStorage.getItem('token');
      const finalRole  = localStorage.getItem('role');

      setToken(finalToken);
      setRole(finalRole);
      setPage(finalToken ? (finalRole === 'admin' ? 'admin' : 'profile') : 'login');
      setBooting(false);
    };
    hydrate();
  }, []);

  // Bắt token reset từ URL (?token=...)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const t = q.get('token');
    if (t) {
      setResetToken(t);
      setPage('reset');
    }
  }, []);

  // Khi token đổi (login/log out) -> cập nhật header + trang mặc định
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const r = localStorage.getItem('role');
      setRole(r);
      setPage(r === 'admin' ? 'admin' : 'profile');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setRole(null);
      setPage('login');
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setRole(null);
    setPage('login');
  };
if (booting) return <div className="app-container"><p>Đang khởi tạo...</p></div>;

  return (
    <div className="app-container">
      <h1 className="app-title">Quản lý người dùng</h1>

      {!token ? (
        <>
          {page === 'login' ? (
            <>
              <LoginForm
                setToken={setToken}
                onLogged={(r) => {
                  setRole(r);
                  setPage(r === 'admin' ? 'admin' : 'profile');
                }}
                onForgot={() => setPage('forgot')}
              />
              <p>
                Chưa có tài khoản?{' '}
                <button onClick={() => setPage('register')} className="btn btn-link">
                  Đăng ký ngay
                </button>
              </p>
            </>
          ) : page === 'register' ? (
            <>
              <RegisterForm />
              <p>
                Đã có tài khoản?{' '}
                <button onClick={() => setPage('login')} className="btn btn-link">
                  Đăng nhập
                </button>
              </p>
            </>
          ) : page === 'forgot' ? (
            <>
              <ForgotPassword onBack={() => setPage('login')} />
            </>
          ) : page === 'reset' ? (
            <>
              <ResetPassword presetToken={resetToken} onBack={() => setPage('login')} />
            </>
          ) : null}
        </>
      ) : (
        <>
          <div className="toolbar">
            {role === 'admin' && (
              <button className="btn btn-outline" onClick={() => setPage('admin')}>
                Người dùng
              </button>
            )}
            <button className="btn btn-outline" onClick={() => setPage('profile')}>
              Hồ sơ
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>

          {page === 'admin' && role === 'admin' ? <AdminPage /> : <ProfilePage />}
        </>
      )}
    </div>
  );
}

export default App;