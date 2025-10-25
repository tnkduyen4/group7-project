// src/components/AdminPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null); // user đang sửa
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const token = localStorage.getItem('token');
  const authHeaders = { Authorization: `Bearer ${token}` };

  const load = async () => {
    try {
      const res = await axios.get('/users', { headers: authHeaders });
      setUsers(res.data || []);
    } catch (e) {
      alert(e?.response?.data?.message || 'Không đủ quyền hoặc lỗi server');
      setUsers([]);
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/users/${editing._id}`, { name: form.name, email: form.email }, { headers: authHeaders });
      } else {
        await axios.post('/users',
          { name: form.name, email: form.email, password: form.password || 'User@123' },
          { headers: authHeaders }
        );
      }
      setForm({ name: '', email: '', password: '' });
      setEditing(null);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Lưu người dùng thất bại');
    }
  };

  const onEdit = (u) => {
    setEditing(u);
    setForm({ name: u.name || '', email: u.email || '', password: '' });
  };

  const onCancel = () => {
    setEditing(null);
    setForm({ name: '', email: '', password: '' });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Xóa user này?')) return;
    try {
      await axios.delete(`/users/${id}`, { headers: authHeaders });
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || 'Xóa thất bại');
    }
  };

  return (
    <div>
      <h2 className="app-title">Quản trị người dùng</h2>

      {/* Form thêm/sửa */}
      <form className="adduser-form" onSubmit={onSubmit} style={{ marginBottom: 16 }}>
        <input name="name" placeholder="Tên" value={form.name} onChange={onChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} />
        {!editing && (
          <input name="password" type="password" placeholder="Mật khẩu (mặc định User@123 nếu bỏ trống)"
                 value={form.password} onChange={onChange} />
        )}
        <button className="btn btn-primary" type="submit">{editing ? 'Cập nhật' : 'Thêm'}</button>
        {editing && <button type="button" className="btn btn-outline" onClick={onCancel} style={{ marginLeft: 8 }}>Hủy</button>}
      </form>

      {/* Bảng */}
      {users.length === 0 ? <p className="empty-message">Chưa có người dùng.</p> : (
        <table className="user-table">
          <thead><tr><th>#</th><th>Tên</th><th>Email</th><th>Role</th><th>Hành động</th></tr></thead>
          <tbody>
            {users.map((u,i)=>(
              <tr key={u._id}>
                <td>{i+1}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={()=>onEdit(u)}>Sửa</button>{' '}
                  <button className="btn btn-danger btn-sm" onClick={()=>onDelete(u._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
