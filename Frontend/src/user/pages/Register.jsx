import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../../context/AuthContext';

import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const { setUserEmail } = useContext(AuthContext);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    async function registerUser() {
      try {
        const response = await axios.post('/user/register', {
          name,
          email,
          password,
          phoneNumber,
        });

        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('uid', response.data.userId);
        setUserEmail(email);

        navigate(response.data.redirect);
      } catch (err) {
        if (err.response) {
          alert(err.response.data.message);
        } else {
          alert('An error occurred. Please try again later.');
        }
      }
    }
    
    registerUser();
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Register</h2>
      <div className="data-container">
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <label>Phone Number:</label>
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required/>
      </div>
      <button type="submit" className="btn-submit">Register</button>
    </form>
  );
}

export default Register;

