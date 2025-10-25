// src/components/LoginForm.jsx
import React, { useState } from "react";
import axios from "axios";

function LoginForm({ setToken, onLogged }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/auth/login", formData);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        if (data.role)  localStorage.setItem("role", data.role);
        if (data.name)  localStorage.setItem("name", data.name);
        if (data.email) localStorage.setItem("email", data.email);

        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setToken(data.token);
        onLogged?.(data.role);
      } else {
        setMessage(data?.message || "Sai email hoặc mật khẩu!");
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || "Lỗi kết nối server!");
    }
  };

  return (
    <div className="app-container">
      <h2 className="app-title">Đăng nhập</h2>
      <form className="adduser-form" onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
        <button className="btn btn-primary" type="submit">Đăng nhập</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default LoginForm;
