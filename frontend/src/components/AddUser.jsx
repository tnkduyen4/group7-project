import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AddUser({ onAdded, editingUser, onCancel }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState(''); // chỉ dùng khi THÊM
  const isEditing = !!editingUser;

  useEffect(() => {
    if (isEditing) {
      setName(editingUser?.name || '');
      setEmail(editingUser?.email || '');
      setPass('');
    } else {
      setName('');
      setEmail('');
      setPass('');
    }
  }, [isEditing, editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Vui lòng nhập đầy đủ Tên và Email!');
      return;
    }

    try {
      if (isEditing) {
        // PUT: cập nhật user
        await axios.put(`/users/${editingUser._id}`, { name, email });
      } else {
        // POST: tạo user
        // Nếu backend yêu cầu mật khẩu, truyền { name, email, password }.
        // Nếu backend KHÔNG bắt buộc password, có thể chỉ gửi { name, email }.
        const payload = password ? { name, email, password } : { name, email };
        await axios.post('/users', payload);
      }

      onAdded && onAdded();
    } catch (err) {
      console.error('Lỗi khi lưu người dùng:', err);
      alert(err?.response?.data?.message || 'Lưu người dùng thất bại');
    }
  };

  return (
    <form className="adduser-form" onSubmit={handleSubmit} style={{ alignItems: 'center' }}>
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

      {!isEditing && (
        <input
          type="password"
          placeholder="Mật khẩu (nếu backend yêu cầu)"
          value={password}
          onChange={(e) => setPass(e.target.value)}
        />
      )}

      <button className="btn btn-primary" type="submit">
        {isEditing ? 'Cập nhật' : 'Thêm'}
      </button>

      {isEditing && (
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          style={{ marginLeft: 8 }}
        >
          Hủy sửa
        </button>
      )}
    </form>
  );
}
