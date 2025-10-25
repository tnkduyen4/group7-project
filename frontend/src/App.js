import React, { useState } from 'react';
import './App.css';
import UserList from './components/UserList';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [page, setPage] = useState('login');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPage('login');
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Quản lý người dùng</h1>

      {!token ? (
        <>
          {page === 'login' ? (
            <>
              <LoginForm setToken={setToken} />
              <p>
                Chưa có tài khoản?{' '}
                <button onClick={() => setPage('register')} style={{ color: '#007bff', border: 'none', background: 'none', cursor: 'pointer' }}>
                  Đăng ký ngay
                </button>
              </p>
            </>
          ) : (
            <>
              <RegisterForm />
              <p>
                Đã có tài khoản?{' '}
                <button onClick={() => setPage('login')} style={{ color: '#007bff', border: 'none', background: 'none', cursor: 'pointer' }}>
                  Đăng nhập
                </button>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', float: 'right' }}>
            Đăng xuất
          </button>
          <UserList />
        </>
      )}
    </div>
  );
}

export default App;
