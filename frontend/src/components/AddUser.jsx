import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddUser({ onAdded, editingUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Khi có user cần sửa thì tự điền thông tin vào form
  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      if (editingUser) {
        // Nếu đang sửa → gửi PUT request
        await axios.put(`http://localhost:3000/users/${editingUser._id}`, { name, email });
      } else {
        // Nếu thêm mới → gửi POST request
        await axios.post('http://localhost:3000/users', { name, email });
      }

      setName('');
      setEmail('');
      onAdded(); // reload danh sách
    } catch (err) {
      console.error('Lỗi khi lưu người dùng:', err);
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
      <button type="submit">{editingUser ? 'Cập nhật' : 'Thêm'}</button>
    </form>
  );
}
