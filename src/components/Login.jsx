import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import  UserActions  from '../actions/UserActions'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Get login function from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      var userData = response.data
      console.log('Login response:', userData);

      // Assuming the server responds with a user object or token
      if (userData) {
        UserActions.updateUser(userData);
        // Here, you can save any user data or token you might need
        localStorage.setItem('authToken', userData.token); // Save token if provided
        login(); // Update authentication state
        navigate('/dashboard'); // Navigate to dashboard
      } else {
        console.error('User data not found in response');
      }
    } catch (err) {
      console.error('Login error:', err);
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
