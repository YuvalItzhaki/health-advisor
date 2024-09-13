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
  const [userId, setUserId] = useState(null); // State for userId

  const navigate = useNavigate();

  // Check localStorage and UserStore for user data on component mount
  useEffect(() => {
    const storedUser = userStoreInstance.getUser() || JSON.parse(localStorage.getItem('user'));
    
    if (storedUser && storedUser.userId) {
      setUserId(storedUser.userId); // Set userId
      localStorage.setItem('user', JSON.stringify(storedUser)); // Ensure it's in localStorage
      UserActions.updateUser(storedUser); // Update UserStore in case it's not up-to-date
    } else {
      navigate('/login'); // Redirect to login if no userId found
    }
  }, [navigate]);

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
