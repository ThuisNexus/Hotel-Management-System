import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../../context/AuthContext';

import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUserEmail } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/user/login', { email, password });

      const { userId, token } = response.data;

      localStorage.setItem('uid', userId);
      localStorage.setItem('token', token);
      setUserEmail(email);

      console.log(userId)
      console.log(token)
      navigate('/');
    } catch (err) {
      alert('Error during login. Please check your credentials.');
    }
  };

  return (
    <div className="whole-container">
        <form onSubmit={handleSubmit} className="form-container">
        <h2>Login</h2>
        <div className="input-container">
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>
        <button type="submit">Login</button>
        </form>
        <div className="register-container">
            <h2>Enter your personal details and start journey with us.</h2>
            <button onClick={() => navigate('/register')}>Sign Up</button>
        </div>
    </div>
  );
}

export default Login;
