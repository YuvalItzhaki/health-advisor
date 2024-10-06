import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userStoreInstance from '../stores/UserStore';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


function HealthMetrics() {
  const [healthData, setHealthData] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('user')); // Parse the user from localStorage
  const userId = userStoreInstance.getUser()?.userId || (storedUser ? storedUser._id : null);
  const googleId = Cookies.get('googleId');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchHealthData = async (id, type) => {
      try {
        const token = localStorage.getItem('authToken') || Cookies.get('authToken'); // This is only available in the browser
    
        if (!token) {
          console.error('No token found. Redirecting to login...');
          navigate('/login');
          return;
        }
    
        const response = await axios.get('http://localhost:5001/api/health/data/${googleId || userId}', {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token from localStorage
          },
          params: {
            userId: id || undefined,
            googleId: googleId || undefined,
          },
        });
    
        if (response.data) {
          setHealthData(response.data);
        } else {
          navigate('/initial-setup');
        }
    
        console.log('Fetched healthData:', response.data);
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };
    

    if (userId) {
      // Fetch health data using userId
      fetchHealthData(userId, 'userId');
    } else if (googleId) {
      // If the user logs in with Google and has no userId, use googleId
      fetchHealthData(googleId, 'googleId');
    }
  }, [userId, googleId]);

  // Loading state
  if (!healthData) {
    return <div>Loading health data...</div>;
  }

  // Extract weights and heights from healthData
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
