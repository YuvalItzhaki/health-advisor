import React, { useState, useEffect } from 'react';
import '../style/Header.css';
import logo from '../assets/logo/logo.webp';
import UserStore from '../stores/UserStore';  // Import the Flux store for user data
import UserActions from '../actions/UserActions';  // Import user-related actions
import { useNavigate } from 'react-router-dom';

function Header({ profilePicture }) {
  const [name, setName] = useState('');  // Initialize name state
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in UserStore or localStorage
    const loadUser = () => {
      const user = UserStore.getUser();
      if (user) {
        setName(user.name);
      } else {
        // If no user in store, try to load from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setName(parsedUser.name);
          UserActions.updateUser(parsedUser);  // Update UserStore with localStorage data
        }
      }
    };

    loadUser();  // Load user on component mount

    // Add the change listener to update when UserStore changes
    UserStore.addChangeListener(loadUser);

    // Clean up the listener when the component unmounts
    return () => {
      UserStore.removeChangeListener(loadUser);
    };
  }, []);

  const handleLogout = () => {
    UserActions.logout();  // Call the logout action
    Cookies.remove('authToken', { path: '/', secure: true, sameSite: 'strict' });
    localStorage.removeItem('authToken')
    navigate('/login');  // Navigate to the login page
  };


  return (
    <header className="dashboard-header">
      <div className="left-section">
        <img src={logo} alt="App Logo" className="logo" />
        <h1 className="title">User Dashboard</h1>
      </div>

      <div className="center-section">
        <h2 className="welcome-message">Welcome, {name}!</h2>
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
