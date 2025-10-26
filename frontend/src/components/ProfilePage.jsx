// src/components/ProfilePage.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [viewUser, setViewUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [msg, setMsg] = useState('');
  const [upMsg, setUpMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const safeSetMsg = (text) => { setMsg(text); if (text) setTimeout(()=>setMsg(''), 3000); };
  const safeSetUpMsg = (text) => { setUpMsg(text); if (text) setTimeout(()=>setUpMsg(''), 3000); };

  const load = async () => {
    try {
      const { data } = await axios.get('/profile');
      setViewUser(data);
      setForm({ name: data?.name || '', email: data?.email || '' });
    } catch (e) {
      if (e?.response?.status === 401) { localStorage.clear(); window.location.reload(); return; }
      safeSetMsg(e?.response?.data?.message || 'Không tải được hồ sơ');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const changed = useMemo(() => {
    if (!viewUser) return false;
    return (form.name || '') !== (viewUser.name || '') ||
           (form.email || '') !== (viewUser.email || '');
  }, [form, viewUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!changed) return;
    setSaving(true);
    try {
      const { data } = await axios.put('/profile', form);
      if (data?.user) {
        setViewUser(data.user);
        setForm({ name: data.user.name || '', email: data.user.email || '' });
      }
      safeSetMsg('Cập nhật thành công');
    } catch (e) {
      if (e?.response?.status === 401) { localStorage.clear(); window.location.reload(); return; }
      safeSetMsg(e?.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadClick = () => inputRef.current?.click();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = /^image\/(png|jpe?g|webp|gif)$/i.test(file.type);
    if (!isImage) { safeSetUpMsg('Chỉ chấp nhận ảnh PNG/JPG/WEBP/GIF'); return; }
    if (file.size > 2 * 1024 * 1024) { safeSetUpMsg('Ảnh vượt quá 2MB'); return; }

    setUploading(true);
    setProgress(0);
    setUpMsg('Đang tải lên...');

    try {
      const fd = new FormData();
      fd.append('avatar', file);

      const { data } = await axios.post('/profile/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (pe) => { if (pe.total) setProgress(Math.round((pe.loaded * 100) / pe.total)); }
      });

      if (data?.user) {
setViewUser(data.user);
      } else {
        const url = data.url || data.secure_url;
        if (url) setViewUser((u) => ({ ...u, avatar: url }));
      }
      safeSetUpMsg('Tải avatar thành công');
    } catch (e) {
      if (e?.response?.status === 401) { localStorage.clear(); window.location.reload(); return; }
      safeSetUpMsg(e?.response?.data?.message || 'Upload thất bại');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleSelfDelete = async () => {
    if (!viewUser?._id) return;
    if (!window.confirm('Bạn chắc chắn muốn xoá tài khoản của mình?')) return;
    try {
      await axios.delete(`/users/${viewUser._id}`);
      alert('Đã xoá tài khoản của bạn.');
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      if (e?.response?.status === 401) { localStorage.clear(); window.location.reload(); return; }
      alert(e?.response?.data?.message || 'Xoá tài khoản thất bại');
    }
  };

  if (loading) return <p className="empty-message">Đang tải hồ sơ...</p>;
  if (!viewUser) return <p className="empty-message">Không có dữ liệu hồ sơ.</p>;

  return (
    <div className="profile">
      <h2 className="app-title">Hồ sơ cá nhân</h2>

      {/* Avatar + upload */}
      <div className="profile-avatar">
        <img
          className="profile-avatar-img"
          src={viewUser.avatar || 'https://placehold.co/120x120?text=avatar'}
          alt="avatar"
        />
        <div className="profile-avatar-actions">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="profile-file-input"
          />
          <button className="btn btn-outline" onClick={handleUploadClick} disabled={uploading}>
            {uploading ? 'Đang tải...' : 'Chọn ảnh'}
          </button>
        </div>

        {uploading && (
          <div className="upload-progress">
            <div className="upload-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}
        {upMsg && <p className="empty-message upload-message">{upMsg}</p>}
      </div>

      {/* Bảng thông tin */}
      <table className="user-table profile-table">
        <thead>
          <tr><th>Trường</th><th>Giá trị</th></tr>
        </thead>
        <tbody>
          <tr><td>Tên</td><td>{viewUser.name}</td></tr>
          <tr><td>Email</td><td>{viewUser.email}</td></tr>
          {viewUser.role && <tr><td>Vai trò</td><td>{viewUser.role}</td></tr>}
        </tbody>
      </table>

      {/* Form cập nhật */}
      <form className="adduser-form profile-form" onSubmit={handleUpdate}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tên" />
<input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <button className="btn btn-primary" type="submit" disabled={!changed || saving}>
          {saving ? 'Đang lưu...' : 'Cập nhật'}
        </button>
        <button type="button" className="btn btn-danger" onClick={handleSelfDelete}>
          Xoá tài khoản của tôi
        </button>
      </form>

      {msg && <p className="empty-message profile-message">{msg}</p>}
    </div>
  );
}

export default ProfilePage;