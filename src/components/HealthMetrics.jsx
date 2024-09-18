import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userStoreInstance from '../stores/UserStore';

function HealthMetrics() {
  const [healthData, setHealthData] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('user')); // Parse the user from localStorage
  const userId = userStoreInstance.getUser()?.userId || (storedUser ? storedUser._id : null);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/health/data?userId=${userId}`);
        setHealthData(response.data);
        console.log('Fetched healthData:', response.data);
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    if (userId) {
      fetchHealthData();
    }
  }, [userId]);

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
