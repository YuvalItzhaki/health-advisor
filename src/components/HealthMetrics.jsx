import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function HealthMetrics({ onSelectWeight }) {
  const [weights, setWeights] = useState([]);
  const userId = useSelector((state) => state.userId.userId); // Get the userId from Redux

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/health/weights/${userId}`);
        setWeights(response.data);
      } catch (error) {
        console.error('Error fetching weights:', error);
      }
    };

    fetchWeights();
  }, [userId]);

  return (
    <div>
      <h3>Your Weights</h3>
      {weights.map((weight) => (
        <div key={weight._id} onClick={() => onSelectWeight(weight)}>
          Weight: {weight.weight}
        </div>
      ))}
    </div>
  );
}

export default HealthMetrics;
