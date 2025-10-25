import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [viewUser, setViewUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/profile'); // đã có baseURL + Authorization từ App.js
        setViewUser(res.data);
        setForm({ name: res.data?.name || '', email: res.data?.email || '' });
      } catch (e) {
        setMessage(e?.response?.data?.message || 'Không tải được hồ sơ');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.put('/profile', form);
      setViewUser(res.data.user);
      setMessage('Cập nhật thành công');
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleSelfDelete = async () => {
    if (!viewUser?._id) return;
    if (!window.confirm('Bạn chắc chắn muốn xoá tài khoản của mình?')) return;
    try {
      await axios.delete(`/users/${viewUser._id}`); // backend: requireSelfOrRole cho phép chính chủ xoá
      alert('Đã xoá tài khoản của bạn.');
      // logout nhẹ nhàng
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      alert(e?.response?.data?.message || 'Xoá tài khoản thất bại');
    }
  };

  if (loading) return <p className="empty-message">Đang tải hồ sơ...</p>;
  if (!viewUser) return <p className="empty-message">Không có dữ liệu hồ sơ.</p>;

  return (
    <div>
      <h2 className="app-title">Hồ sơ cá nhân</h2>

      <table className="user-table" style={{ marginBottom: 20 }}>
        <thead><tr><th>Trường</th><th>Giá trị</th></tr></thead>
        <tbody>
          <tr><td>Tên</td><td>{viewUser.name}</td></tr>
          <tr><td>Email</td><td>{viewUser.email}</td></tr>
          {viewUser.role && <tr><td>Vai trò</td><td>{viewUser.role}</td></tr>}
        </tbody>
      </table>

      <form className="adduser-form" onSubmit={handleUpdate}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tên" />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <button className="btn btn-primary" type="submit">Cập nhật</button>
        <button type="button" className="btn btn-danger" onClick={handleSelfDelete} style={{ marginLeft: 8 }}>
          Xoá tài khoản của tôi
        </button>
      </form>

      {message && <p className="empty-message">{message}</p>}
    </div>
  );
}

export default ProfilePage;
