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
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [userId, setUserId] = useState(null);
  const [googleId, setGoogleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userFromStore = userStoreInstance.getUser();
    const storedUserId = userFromStore?.userId || storedUser?._id || storedUser?.userId || null;
    const googleIdFromCookies = Cookies.get('googleId');
    const authToken = localStorage.getItem('authToken') || Cookies.get('authToken');
    console.log('storedUserId', storedUserId)


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
  const handleWeightSave = (newWeight) => {
    const googleIdFromCookies = Cookies.get('googleId');
    // const id = userId || googleIdFromCookies;
    const id = storedUserId || googleIdFromCookies;


    axios
      .put(`http://localhost:5001/api/health/weights/${id}`, {
        weights: [{ value: newWeight, date: new Date() }],
      })
      .then((response) => {
        console.log('Weight updated:', response.data);
        const updatedWeight = { value: newWeight, date: new Date() };
        setWeights([...weights, updatedWeight]);
        setSelectedWeight(updatedWeight);
      })
      .catch((error) => {
        console.error('Error updating weight:', error);
      });
  };

  const handleHeightSave = (newHeight) => {
    axios
      .put(`http://localhost:5001/api/health/heights/${userId || googleId}`, {
        heights: [{ value: newHeight, date: new Date() }],
      })
      .then((response) => {
        console.log('Height updated:', response.data);
        const updatedHeight = { value: newHeight, date: new Date() };
        setHeights([...heights, updatedHeight]);
        setSelectedHeight(updatedHeight);
      })
      .catch((error) => {
        console.error('Error updating height:', error);
      });
  };

  const handleSaveAll = () => {
    if (!userId && !googleId) return;

    axios
      .put(`http://localhost:5001/api/health/${userId || googleId}`, {
        weight: selectedWeight?.weight,
        height: selectedHeight?.height,
      })
      .then((response) => {
        console.log('Health data updated:', response.data);
        setWeights(response.data.weights || []);
        setHeights(response.data.heights || []);
      })
      .catch((error) => {
        console.error('Error saving health data:', error);
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
          <WeightForm onChange={(newWeight) => handleWeightSave(newWeight, 'weight')} showSaveButton={true} />
          {/* <WeightForm
            existingWeight={selectedWeight ? selectedWeight.weight : ''}
            onChange={handleWeightSave}
            showSaveButton={true}
          /> */}
          <h4>Height</h4>
          <HeightForm onChange={(newHeight) => handleHeightSave(newHeight, 'height')} showSaveButton={true} />
          {/* <HeightForm
            existingHeight={selectedHeight ? selectedHeight.height : ''}
            onChange={handleHeightSave}
            showSaveButton={true}
          /> */}
        </div>
      </div>
      {/* <button onClick={handleSaveAll}>Save All</button> */}
      <HealthHistory />
    </div>
  );
}

export default Dashboard;
