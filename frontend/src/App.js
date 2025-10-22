import React from 'react';
import './App.css';
import UserList from './components/UserList';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Quản lý người dùng</h1>
      <UserList />
    </div>
  );
}

export default App;
