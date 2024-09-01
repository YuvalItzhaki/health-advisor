import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserId } from '../store/actions/userActions'; // Import the action that sets the userId in Redux
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      const userId = response.data._id; // Adjust based on response structure
      if (userId) {
        dispatch(setUserId(userId)); // Store userId in Redux
        navigate('/dashboard');
      } else {
        console.error('User ID not found in response');
      }
    } catch (err) {
      console.error(err);
    } 
  };
  

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
