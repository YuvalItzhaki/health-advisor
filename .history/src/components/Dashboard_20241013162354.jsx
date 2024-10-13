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
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { fitData, error, fetchGoogleFitData } = useGoogleFitData();

  // Update steps when fitData changes
  useEffect(() => {
    if (fitData.steps) {
      setFitDataSteps(fitData.steps);
    }
  }, [fitData]);

  useEffect(() => {
    // Your existing code to fetch health data...
  }, [navigate]);

  // Your existing functions like fetchHealthData, handleWeightSave, handleHeightSave...

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
          <WeightForm onChange={(newWeight) => handleWeightSave(newWeight)} showSaveButton={true} />
          <h4>Height</h4>
          <HeightForm onChange={(newHeight) => handleHeightSave(newHeight)} showSaveButton={true} />
        </div>
        <div>
          <h2>Google Fit Data</h2>
          {error && <p>{error}</p>}
          <p>Steps: {fitData.steps > 0 ? fitData.steps : 'No steps data available.'}</p>
          <p>Calories: {fitData.calories > 0 ? fitData.calories.toFixed(2) : 'No calories data available.'}</p>
          <button onClick={handleRefreshSteps}>Refresh Data</button>
        </div>
      </div>
      <HealthHistory />
    </div>
  );
}

export default Dashboard;
