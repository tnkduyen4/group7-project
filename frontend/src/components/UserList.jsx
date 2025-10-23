import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUser from './AddUser';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // user đang được sửa

  // Lấy danh sách user
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu người dùng:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm xử lý xóa user
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này không?')) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        console.error('Lỗi khi xóa người dùng:', err);
      }
    }
  };

  // Hàm chọn user để sửa
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // Khi form thêm/sửa xong thì reload lại danh sách
  const handleSaved = () => {
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <div className="userlist-container">
      <h2>Danh sách người dùng</h2>
      <AddUser onAdded={handleSaved} editingUser={editingUser} />

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
                  <button onClick={() => handleEdit(u)}>Sửa</button>
                  <button onClick={() => handleDelete(u._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
