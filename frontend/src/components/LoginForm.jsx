import React, { useState } from "react";

function LoginForm({ setToken }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("Đăng nhập thành công!");
        setToken(data.token);
      } else {
        setMessage(data.message || "Sai email hoặc mật khẩu!");
      }
    } catch (err) {
      setMessage("Lỗi kết nối server!");
    }
  };

  return (
    <div className="app-container">
      <h2 className="app-title">Đăng nhập</h2>
      <form className="adduser-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default LoginForm;
