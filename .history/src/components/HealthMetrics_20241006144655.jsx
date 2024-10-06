import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userStoreInstance from '../stores/UserStore';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function HealthMetrics() {
  const [healthData, setHealthData] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = userStoreInstance.getUser()?.userId || (storedUser ? storedUser._id : null);
  const googleId = Cookies.get('googleId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealthData = async (id) => {
      try {
        const token = localStorage.getItem('authToken') || Cookies.get('authToken');

        if (!token) {
          console.error('No token found. Redirecting to login...');
          navigate('/login');
          return;
        }

        const apiPath = googleId ? `google/${googleId}` : `user/${userId}`;
        const response = await axios.get(`http://localhost:5001/api/health/${apiPath}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setHealthData(response.data);
        } else {
          console.log('No health data found, redirecting to initial setup.');
          navigate('/initial-setup');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('No health data found, redirecting to initial setup.');
          navigate('/initial-setup');
        } else {
          console.error('Error fetching health data:', error);
        }
      }
    };

    if (userId || googleId) {
      fetchHealthData();
    }
  }, [userId, googleId, navigate]);

  if (!healthData) {
    return <div>Loading health data...</div>;
  }

  const weights = healthData.weights || [];
  const heights = healthData.heights || [];

  const latestWeight = weights.length ? weights[weights.length - 1].value : 'No data';
  const latestHeight = heights.length ? heights[heights.length - 1].value : 'No data';

  return (
    <div>
      <h3>Your Health Data</h3>
      <p>Current Weight: {latestWeight} KG</p>
      <p>Current Height: {latestHeight} CM</p>
      <p>Age: {healthData.age}</p>
      <p>Gender: {healthData.gender}</p>
    </div>
  );
}

export default HealthMetrics;
