import React from 'react';
import '../style/Header.css';
import { useSelector } from 'react-redux';


function Header({ userName, profilePicture }) {
  const name = useSelector((state) => state.userId.name); // Get the userId from Redux

  return (
    <header className="dashboard-header">
      <div className="left-section">
        <img src="/path-to-logo.png" alt="App Logo" className="logo" />
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
          <button className="logout-button">Logout</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
