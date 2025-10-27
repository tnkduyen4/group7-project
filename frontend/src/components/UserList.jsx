import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUser from './AddUser';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // 👈 user đang sửa
  const role = localStorage.getItem('role');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users');   // Authorization đã gắn ở App.js
      setUsers(res.data || []);
    } catch (err) {
      alert(err?.response?.data?.message || 'Không đủ quyền');
      setUsers([]);
    }
  };

  useEffect(() => {
    if (role === 'admin') fetchUsers();
  }, [role]);

  if (role !== 'admin') return null; // user thường: không render danh sách

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá?')) return;
    try {
      await axios.delete(`/users/${id}`);
      setUsers((list) => list.filter(u => u._id !== id));
      // nếu đang sửa đúng user đó thì hủy chế độ sửa
      if (editingUser && editingUser._id === id) setEditingUser(null);
    } catch (e) {
      alert(e?.response?.data?.message || 'Xoá thất bại');
    }
  };

  const handleEditClick = (u) => setEditingUser(u);
  const handleCancelEdit = () => setEditingUser(null);

  const handleSaved = async () => {
    setEditingUser(null);
    await fetchUsers();
  };

  return (
    <div className="userlist-container">
      <h2>Danh sách người dùng (Admin)</h2>

      {/* Form thêm/sửa dùng chung */}
      <AddUser onAdded={handleSaved} editingUser={editingUser} onCancel={handleCancelEdit} />

      {users.length === 0 ? (
        <p className="empty-message">Chưa có người dùng nào.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id || i}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => handleEditClick(u)}>
                    Sửa
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)} style={{ marginLeft: 8 }}>
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
