import React, { useEffect, useState } from 'react';
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

function Dashboard() {
  const [weights, setWeights] = useState([]);
  const [heights, setHeights] = useState([]);
  const [userId, setUserId] = useState(null);
  const [googleId, setGoogleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userFromStore = userStoreInstance.getUser();
    const storedUserId = userFromStore?.userId || storedUser?._id || null;
    const googleIdFromCookies = Cookies.get('googleId');
    const authToken = localStorage.getItem('authToken') || Cookies.get('authToken');

    if (!authToken) {
      console.log('No authToken, redirecting to login.');
      navigate('/login');
      return;
    }

    if (googleIdFromCookies) {
      fetchHealthData(`google/${googleIdFromCookies}`, authToken);
    } else if (storedUserId) {
      fetchHealthData(`user/${storedUserId}`, authToken);
    } else {
      console.log('No userId or googleId, redirecting to login.');
      navigate('/login');
    }
  }, [navigate]);

  const fetchHealthData = (apiPath, authToken) => {
    axios.get(`http://localhost:5001/api/health/${apiPath}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    .then((response) => {
      const healthData = response.data;
      setWeights(healthData.weights || []);
      setHeights(healthData.heights || []);
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        console.log('No health data found, redirecting to initial setup.');
        navigate('/initial-setup');
      } else {
        console.error('Error fetching health data:', error);
      }
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
          <WeightForm onChange={(newWeight) => handleSave(newWeight, 'weight')} showSaveButton={true} />
          {/* <WeightForm
            existingWeight={selectedWeight ? selectedWeight.weight : ''}
            onChange={handleWeightSave}
            showSaveButton={true}
          /> */}
          <h4>Height</h4>
          <HeightForm
            existingHeight={selectedHeight ? selectedHeight.height : ''}
            onChange={handleHeightSave}
            showSaveButton={true}
          />
        </div>
      </div>
      <button onClick={handleSaveAll}>Save All</button>
      <HealthHistory />
    </div>
  );
}

export default Dashboard;
