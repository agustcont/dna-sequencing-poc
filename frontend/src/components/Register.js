// src/components/Register.js
import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'customer' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://172.18.15.155:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (response.ok) {
      alert('Registration successful!');
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" onChange={handleChange} placeholder="Enter username" />
        <input type="password" name="password" onChange={handleChange} placeholder="Enter password" />
        <select name="role" onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="business">Business</option>
        </select>
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
