import React from 'react';
import '../style/Header.css';
import { useSelector } from 'react-redux';
import logo from '../assets/logo/logo.webp';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice'; // Assuming you have a logout action in your store



function Header({profilePicture }) {
  const name = useSelector((state) => state.userId.name); // Get the userId from Redux

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data (assuming you use redux-persist or something similar)
    dispatch(logout());

    // Optionally clear localStorage if you store any token
    localStorage.removeItem('authToken');

    // Navigate to login page
    navigate('/login');
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