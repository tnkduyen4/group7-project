import React, { useState } from 'react';
import axios from 'axios';

export default function AddUser({ onAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      await axios.post('http://localhost:3000/users', { name, email });
      setName('');
      setEmail('');
      onAdded();
    } catch (err) {
      console.error('Lỗi khi thêm người dùng:', err);
    }
  };

  return (
    <form className="adduser-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tên người dùng"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email người dùng"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Thêm</button>
    </form>
  );
}
