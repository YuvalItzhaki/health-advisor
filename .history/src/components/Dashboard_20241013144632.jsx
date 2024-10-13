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
import googleFitData from './GoogleFitData';

function Dashboard() {
  const [weights, setWeights] = useState([]);
  const [heights, setHeights] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [userId, setUserId] = useState(null);
  const [fitDataSteps, setFitDataSteps] = useState(0);
  const [isLoadingFitData, setIsLoadingFitData] = useState(false);
  const navigate = useNavigate();
  const { fitData, error } = googleFitData();

  // Fetch initial health data and fit data on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userFromStore = userStoreInstance.getUser();
    const storedUserId = userFromStore?.userId || storedUser?._id || storedUser?.userId || null;
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

    // Fetch fit data
    fetchFitData();
  }, [navigate]);

  // Function to fetch Google Fit data
  const fetchFitData = () => {
    setIsLoadingFitData(true); // Set loading state

    const authToken = localStorage.getItem('authToken') || Cookies.get('authToken');
    
    axios.get('YOUR_GOOGLE_FIT_API_ENDPOINT', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    .then((response) => {
      const steps = response.data.bucket[0].dataset[0].point[0]?.value[0]?.intVal || 0;
      setFitDataSteps(steps);
      setIsLoadingFitData(false); // Reset loading state
    })
    .catch((error) => {
      console.error('Error fetching Google Fit data:', error);
      setIsLoadingFitData(false); // Reset loading state on error
    });
  };

  const fetchHealthData = (apiPath, authToken) => {
    axios
      .get(`http://localhost:5001/api/health/${apiPath}`, {
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

  const getUserIdOrGoogleId = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userFromStore = userStoreInstance.getUser();
    const storedUserId = userFromStore?.userId || storedUser?._id || storedUser?.userId || null;
    const googleIdFromCookies = Cookies.get('googleId');
    return storedUserId || googleIdFromCookies;
  };

  const handleWeightSave = (newWeight) => {
    const id = getUserIdOrGoogleId();

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
    const id = getUserIdOrGoogleId();

    axios
      .put(`http://localhost:5001/api/health/heights/${id}`, {
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
          <h2>Google Fit Steps Data</h2>
          {isLoadingFitData ? (
            <p>Loading steps data...</p>
          ) : (
            <>
              {error && <p>{error}</p>}
              {fitDataSteps > 0 ? (
                <p>Steps: {fitDataSteps}</p>
              ) : (
                <p>No steps data available.</p>
              )}
              <button onClick={fetchFitData}>Refresh Steps</button>
            </>
          )}
        </div>
      </div>
      <HealthHistory />
    </div>
  );
}

export default Dashboard;
