import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './components/Header';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register'
import Navbar from './components/Navbar';
import InitialSetup from './components/InitialSetup';
import {AuthProvider} from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';  // Adjust the path as necessary

function App() {
  // useEffect(() => {
  //   function initClient() {
  //     gapi.load('client:auth2', () => {
  //       gapi.client.init({
  //         clientId: '1068162461501-eiv8qv9rh7esjdhfip5sncm3fsgul276.apps.googleusercontent.com',
  //         scope: 'https://www.googleapis.com/auth/fitness.activity.read',
  //         redirect_uri: 'http://localhost:5173/storagerelay', 
  //       }).then(() => {
  //         console.log('Google API Client initialized successfully');
  //       }).catch((error) => {
  //         console.error('Error initializing Google API Client:', error);
  //       });
  //     });
  //   }

  //   initClient();
  // }, []); // Runs once on component mount

  return (
    <AuthProvider>
    <Router>
      <div className="App">
        {/* <Header /> */}
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />    
          {/* <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />         */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/initial-setup" element={<InitialSetup />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
