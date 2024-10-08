import React, { useState } from 'react';
import WeightForm from './WeightForm';
import HeightForm from './HeightForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userStoreInstance from '../stores/UserStore';
import Cookies from 'js-cookie';

function InitialSetup() {
  // Get user data from UserStore, localStorage, and Cookies
  const storedUser = JSON.parse(localStorage.getItem('user')); // Parse the user from localStorage
  const userId = userStoreInstance.getUser()?.userId || (storedUser ? storedUser._id : null);
  const googleId = Cookies.get('googleId'); // Google ID from cookies

  const [weightValue, setWeightValue] = useState(''); // For storing a single weight input
  const [heightValue, setHeightValue] = useState(''); // For storing a single height input
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  const handleSave = async () => {
    const currentDate = new Date(); // Current date to save with weight and height

    // Prepare the weights and heights arrays with the first record
    const weights = [{ value: Number(weightValue), date: currentDate }];
    const heights = [{ value: Number(heightValue), date: currentDate }];

    try {
      // Send a single POST request with all the data
      const response = await axios.post('http://localhost:5001/api/health/setup', {
        userId: userId || undefined,  // If the user has a userId, pass it
        googleId: googleId || undefined,  // If the user logged in with Google, pass googleId
        weights,
        heights,
        age,
        gender,
      });

      console.log('Initial setup data saved:', response.data);
      navigate('/dashboard'); // Navigate to the dashboard after saving
    } catch (error) {
      console.error('Error saving initial setup data:', error);
    }
  };

  return (
    <div>
      <h2>Initial Setup</h2>

      <p>Please enter your initial weight.</p>
      <WeightForm 
        existingWeight={weightValue} 
        onChange={(value) => setWeightValue(value)} 
        showSaveButton={false} 
      />

      <p>Please enter your height.</p>
      <HeightForm 
        existingHeight={heightValue} 
        onChange={(value) => setHeightValue(value)} 
        showSaveButton={false} 
      />

      <p>Please enter your age.</p>
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>
      
      <p>Please select your gender.</p>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      
      <div>
        <button onClick={handleSave}>Save & Continue</button>
      </div>
    </div>
  );
}

export default InitialSetup;
