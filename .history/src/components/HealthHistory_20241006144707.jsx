import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userStoreInstance from '../stores/UserStore';
import Cookies from 'js-cookie';
import { LineChart, Line, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import XAxis from './CustomComponents'; 
import YAxis from './CustomComponents'; 

function HealthHistory() {
  const [weights, setWeights] = useState([]);
  const [heights, setHeights] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = userStoreInstance.getUser()?.userId || (storedUser ? storedUser._id : null);
  const googleId = Cookies.get('googleId');

  useEffect(() => {
    const fetchHealthHistory = async () => {
      try {
        const token = localStorage.getItem('authToken') || Cookies.get('authToken');
        const apiPath = googleId ? `google/${googleId}` : `user/${userId}`;

        const response = await axios.get(`http://localhost:5001/api/health/${apiPath}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWeights(response.data.weights || []);
        setHeights(response.data.heights || []);
      } catch (error) {
        console.error('Error fetching health history:', error);
      }
    };

    if (userId || googleId) {
      fetchHealthHistory();
    }
  }, [userId, googleId]);

  return (
    <div>
      <h3>Historical Data</h3>

      <div>
        <h4>Weight History</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weights}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" name="Weight (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4>Height History</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={heights}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
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
