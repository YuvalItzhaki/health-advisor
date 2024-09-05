import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register'
import Navbar from './components/Navbar';
import InitialSetup from './components/InitialSetup';


function App() {
  return (
    <Router>
      <div className="App">
        {/* <Header /> */}
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/initial-setup" element={<InitialSetup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
