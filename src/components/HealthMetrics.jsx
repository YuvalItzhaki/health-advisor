import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function HealthMetrics() {
  const [healthData, setHealthData] = useState(null);
  const userId = useSelector((state) => state.userId.userId); // Get the userId from Redux

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
