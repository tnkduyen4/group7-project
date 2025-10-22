import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUser from './AddUser';

export default function UserList() {
  const [users, setUsers] = useState([]);

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

  return (
    <div className="userlist-container">
      <AddUser onAdded={fetchUsers} />

      {users.length === 0 ? (
        <p className="empty-message">Chưa có người dùng nào.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id || i}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
