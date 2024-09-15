import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import WeightForm from './WeightForm';
import HeightForm from './HeightForm';
import Header from './Header';
import HealthMetrics from './HealthMetrics';
import '../style/Dashboard.css';
import userStoreInstance from '../stores/UserStore';
import UserActions from '../actions/UserActions'; // For updating the store

function Dashboard() {
  const [weights, setWeights] = useState([]); // State for weights
  const [heights, setHeights] = useState([]); // State for heights
  const [selectedWeight, setSelectedWeight] = useState(null); // State for selected weight
  const [selectedHeight, setSelectedHeight] = useState(null); // State for selected height
  const [userId, setUserId] = useState(null); // Initialize with null and set later
  const [user, setUser] = useState({}); // Initialize with an empty object


  const navigate = useNavigate();

  // Check localStorage and UserStore for user data on component mount
  useEffect(() => {
    // const storedUser = userStoreInstance.getUser() || JSON.parse(localStorage.getItem('user'));
    // const storedUserId = storedUser?.userId || localStorage.getItem('userId');
    const storedUser = JSON.parse(localStorage.getItem('user')); // Parse the user from localStorage
    const userId = userStoreInstance.getUser()?.userId || (storedUser ? storedUser._id : null);


    if (!userId) {
      navigate('/login'); // If no userId found, redirect to login
    } else {
      setUserId(userId); // Set userId from the store or localStorage
      setUser(storedUser); // Set user data from the store or localStorage
    }
  }, [navigate]); // This effect runs once, on component mount


  // Save individual weight
  const handleWeightSave = (newWeight) => {
    if (!userId) return;

    axios.put(`http://localhost:5001/api/health/weight/${userId}`, { weight: newWeight })
      .then(response => {
        console.log('Weight updated:', response.data);
        setWeights(weights.map(w => w.userId === userId ? response.data : w));
      })
      .catch(error => {
        console.error('Error updating weight:', error);
      });
  };

  // Save individual height
  const handleHeightSave = (newHeight) => {
    if (!userId) return;

    axios.put(`http://localhost:5001/api/health/height/${userId}`, { height: newHeight })
      .then(response => {
        console.log('Height updated:', response.data);
        setHeights(heights.map(h => h.userId === userId ? response.data : h));
      })
      .catch(error => {
        console.error('Error updating height:', error);
      });
  };

  // Save all data (both weight and height)
  const handleSaveAll = () => {
    if (!userId) return;

    axios.put(`http://localhost:5001/api/health/${userId}`, {
      weight: selectedWeight?.weight,
      height: selectedHeight?.height
    })
      .then(response => {
        console.log('Health data updated:', response);
        setWeights(response.data.weights || []); // Fallback to empty array if weights are missing
        setHeights(response.data.heights || []); // Fallback to empty array if heights are missing
      })
      .catch(error => {
        console.error('Error saving health data:', error);
      });
  };

  return (
    <div className="dashboard">
      <Header userName={userStoreInstance.getUser()?.name} /> {/* Pass userName to Header */}
      <div className="metrics-grid">
        <div className="metric-card">
          <HealthMetrics weights={weights} heights={heights} />
        </div>
        <div className="metric-card">
          <h3>Edit Your Health Data</h3>
          <h4>Weight</h4>
          <WeightForm 
            weightId={selectedWeight ? selectedWeight._id : null} 
            existingWeight={selectedWeight ? selectedWeight.weight : ''} 
            onChange={handleWeightSave}
          />
          <h4>Height</h4>
          <HeightForm 
            heightId={selectedHeight ? selectedHeight._id : null} 
            existingHeight={selectedHeight ? selectedHeight.height : ''}
            onChange={handleHeightSave} 
          />
        </div>
      </div>
      {/* Save all data */}
      <button onClick={handleSaveAll}>Save All</button>
    </div>
  );
}

export default Dashboard;
