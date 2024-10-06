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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Utility function to get stored tokens and user info
  const getStoredData = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userFromStore = userStoreInstance.getUser();
    const storedUserId = userFromStore?.userId || storedUser?._id || null;
    const googleIdFromCookies = Cookies.get('googleId');
    const authTokenFromCookies = Cookies.get('authToken');
    
    return { storedUser, storedUserId, googleIdFromCookies, authTokenFromCookies };
  };

  useEffect(() => {
    const { storedUser, storedUserId, googleIdFromCookies, authTokenFromCookies } = getStoredData();

    if (!authTokenFromCookies) {
      console.log('No authToken, redirecting to login.');
      navigate('/login');
      return;
    }

    if (googleIdFromCookies) {
      fetchGoogleUserHealthData(googleIdFromCookies, authTokenFromCookies);
    } else if (storedUserId) {
      setUserId(storedUserId);
      setUser(storedUser);
    } else {
      console.log('No userId or googleId, redirecting to login.');
      navigate('/login');
    }
  }, [navigate]);

  const fetchGoogleUserHealthData = (googleId, authToken) => {
    axios
      .get(`http://localhost:5001/api/health/google/${googleId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        withCredentials: true,
      })
      .then((response) => {
        const healthData = response.data;
        if (healthData) {
          setGoogleId(googleId);
          setWeights(healthData.weights || []);
          setHeights(healthData.heights || []);
          console.log('Existing Google user health data found:', healthData);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log('No health data found for Google user, redirecting to initial setup.');
          navigate('/initial-setup'); // Redirect to initial-setup if 404 is received
        } else {
          console.error('Error fetching Google user health data:', error);
          navigate('/login'); // Redirect to login for other errors
        }
      });
  };

  const handleWeightSave = (newWeight) => {
    const googleIdFromCookies = Cookies.get('googleId');
    const id = userId || googleIdFromCookies;

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
          <WeightForm
            existingWeight={selectedWeight ? selectedWeight.weight : ''}
            onChange={handleWeightSave}
            showSaveButton={true}
          />
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
