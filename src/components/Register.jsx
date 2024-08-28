import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [user, setUser] = useState('');  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', { user, email, password });
      console.log('response from server: ', response.data); // Handle token or errors
    } catch (err) {
      console.error(err);
    } 
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>User:</label>
        <input 
          type="user" 
          value={user} 
          onChange={(e) => setUser(e.target.value)} 
          required 
        />
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
