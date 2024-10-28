import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WeightForm from './WeightForm';
import HeightForm from './HeightForm';
import Header from './Header';
import HealthMetrics from './HealthMetrics';
import '../style/Dashboard.css';
import userStoreInstance from '../stores/UserStore';
import HealthHistory from './HealthHistory';
import Cookies from 'js-cookie';
import useGoogleFitData from './GoogleFitData';

function Dashboard() {
  const [weights, setWeights] = useState([]);
  const [heights, setHeights] = useState([]);
  const navigate = useNavigate();
  const { fitData, error, fetchGoogleFitData } = useGoogleFitData();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken') || Cookies.get('authToken');
    const userId = getUserIdOrGoogleId();

    if (!authToken) {
      console.log('No authToken, redirecting to login.');
      navigate('/login');
      return;
    }

    if (userId) {
      fetchHealthData(userId, authToken);
      if (Cookies.get('googleId')) fetchGoogleFitData();
    } else {
      console.log('No userId or googleId, redirecting to login.');
      navigate('/login');
    }
  }, [navigate]);

  const fetchHealthData = (id, authToken) => {
    axios
      .get(`http://localhost:5001/api/health/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        const healthData = response.data;
        setWeights(healthData.weights || []);
        setHeights(healthData.heights || []);
      })
      .catch((error) => {
        handleFetchError(error);
      });
  };

  const getUserIdOrGoogleId = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userFromStore = userStoreInstance.getUser();
    return userFromStore?.userId || storedUser?._id || Cookies.get('googleId');
  };

  const handleFetchError = (error) => {
    if (error.response && error.response.status === 404) {
      console.log('No health data found, redirecting to initial setup.');
      navigate('/initial-setup');
    } else {
      console.error('Error fetching health data:', error);
    }
  };

  const saveMetric = (type, value) => {
    const id = getUserIdOrGoogleId();
    axios.put(`http://localhost:5001/api/health/update/${type}/${id}`, {
      value: { value, date: new Date() },
    })
      .then((response) => {
        const updatedData = { value, date: new Date() };
        if (type === 'weights') setWeights([...weights, updatedData]);
        else setHeights([...heights, updatedData]);
      })
      .catch((error) => {
        console.error(`Error updating ${type}:`, error);
      });
  };

  return (
    <div className="dashboard">
      <Header userName={userStoreInstance.getUser()?.name} />
      <div className="metrics-grid">
        <div className="metric-card">
          <HealthMetrics weights={weights} heights={heights} />
        </div>
        <div className="metric-card">
          <h3>Edit Your Health Data</h3>
          <h4>Weight</h4>
          <WeightForm onChange={(newWeight) => saveMetric('weights', newWeight)} showSaveButton={true} />
          <h4>Height</h4>
          <HeightForm onChange={(newHeight) => saveMetric('heights', newHeight)} showSaveButton={true} />
        </div>
        {Cookies.get('googleId') && (
          <div>
            <h2>Google Fit Data</h2>
            {error && <p>{error}</p>}
            <p>Steps: {fitData.steps > 0 ? fitData.steps : 'No steps data available.'}</p>
            <p>Calories: {fitData.calories > 0 ? fitData.calories.toFixed(2) : 'No calories data available.'}</p>
            <button onClick={fetchGoogleFitData}>Refresh Data</button>
          </div>
        )}
      </div>
      <HealthHistory />
    </div>
  );
}

export default Dashboard;