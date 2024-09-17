import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userStoreInstance from '../stores/UserStore';
import { LineChart, Line, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import XAxis from './CustomComponents'; // Use the custom XAxis
import YAxis from './CustomComponents'; // Use the custom YAxis

function HealthHistory() {
  const [weights, setWeights] = useState([]);
  const [heights, setHeights] = useState([]);
  const [healthHistory, setHealthHistory] = useState(null);
  
  const storedUser = JSON.parse(localStorage.getItem('user')); // Parse the user from localStorage
  const userId = userStoreInstance.getUser()?.userId || (storedUser ? storedUser._id : null);

  useEffect(() => {
    const fetchHealthHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/health/data?userId=${userId}`);
        
        // Assuming response.data contains the weights and heights arrays
        setWeights(response.data.weights || []);  // Set weights from response
        setHeights(response.data.heights || []);  // Set heights from response
        setHealthHistory(response.data);
        
        console.log('healthHistory data is:', response.data);
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    if (userId) {
      fetchHealthHistory();
    }
  }, [userId]);

  if (!healthHistory) {
    return <div>Loading health history...</div>; // Loading state while fetching data
  }

  return (
    <div>
      <h3>Historical Data</h3>
      
      {/* Weight History */}
      <div>
        <h4>Weight History</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weights}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" /> {/* Assuming data contains 'date' */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" name="Weight (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Height History */}
      <div>
        <h4>Height History</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={heights}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" /> {/* Assuming data contains 'date' */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Height (cm)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HealthHistory;
