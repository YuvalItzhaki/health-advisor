import React, { useState, useEffect } from 'react';
import '../style/Header.css';
import logo from '../assets/logo/logo.webp';
import UserStore from '../stores/UserStore';  // Import the Flux store for user data
import UserActions from '../actions/UserActions';  // Import user-related actions
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';  // Assuming you're using Axios for API calls

function Header({ profilePicture }) {
  const [name, setName] = useState('');  // Initialize name state
  const [email, setEmail] = useState('');  // Add state for email
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data
    const loadUser = async () => {
      const googleId = Cookies.get('googleId');  // Assuming googleId is stored in cookies

      if (googleId) {
        try {
          // Fetch user info from backend using googleId
          const response = await axios.get(`/api/users/google/${googleId}`);
          const { email } = response.data;  // Assume the backend sends back email
          setEmail(email);
          
          // If no name available, use the part before '@' in email as name
          const userName = email ? email.split('@')[0] : '';
          setName(userName);
        } catch (error) {
          console.error("Error fetching Google user data:", error);
        }
      } else {
        // If no googleId, load from Flux store or localStorage
        const user = UserStore.getUser();
        if (user) {
          setName(user.name);
        } else {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setName(parsedUser.name);
            setEmail(parsedUser.email);
            UserActions.updateUser(parsedUser);  // Update UserStore with localStorage data
          }
        }
      }
    };

    loadUser();  // Load user on component mount

    UserStore.addChangeListener(loadUser);

    return () => {
      UserStore.removeChangeListener(loadUser);
    };
  }, []);

  const handleLogout = () => {
    UserActions.logout();
    Cookies.remove('authToken', { path: '/', secure: true, sameSite: 'strict' });
    Cookies.remove('googleId');  // Remove googleId cookie on logout
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="left-section">
        <img src={logo} alt="App Logo" className="logo" />
        <h1 className="title">User Dashboard</h1>
      </div>

      <div className="center-section">
        <h2 className="welcome-message">Welcome, {name}!</h2> {/* Display the name or email-based string */}
      </div>

      <div className="right-section">
        <img src={profilePicture} alt="User Profile" className="profile-picture" />
        <div className="quick-actions">
          <i className="icon-notifications"></i>
          <i className="icon-settings"></i>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
