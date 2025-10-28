import React, { useState } from "react";

function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://group7project.onrender.com';
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMessage(data.message || "Lỗi không xác định");
    } catch (err) {
      setMessage("Lỗi kết nối server!");
    }
  };

  return (
    <div className="app-container">
      <h2 className="app-title">Đăng ký</h2>
      <form className="adduser-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Họ tên"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary" type="submit">Đăng ký</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default RegisterForm;
