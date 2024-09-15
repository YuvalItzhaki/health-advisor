import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userStoreInstance from '../stores/UserStore'


function HealthMetrics() {
  const [healthData, setHealthData] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('user')); // Parse the user from localStorage
  const userId = userStoreInstance.getUser()?.userId || (storedUser ? storedUser._id : null);

  useEffect(() => {

    const fetchHealthData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/health/data?userId=${userId}`);
        setHealthData(response.data);
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    if (userId) {
      fetchHealthData();
    }
  }, [userId]);

  if (!healthData) {
    return <div>Loading health data...</div>; // Loading state while fetching data
  }

  return (
    <div>
      <h3>Your Health Data</h3>
      <p>Weight: {healthData.weight}</p>
      <p>Height: {healthData.height}</p>
      <p>Age: {healthData.age}</p>
      <p>Gender: {healthData.gender}</p>
    </div>
  );
}

export default HealthMetrics;
