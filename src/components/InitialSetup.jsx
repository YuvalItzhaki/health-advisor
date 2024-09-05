import React, { useState } from 'react';
import WeightForm from './WeightForm';
import HeightForm from './HeightForm';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function InitialSetup() {
  const userId = useSelector((state) => state.userId.userId);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      // Send a single POST request with all the data
      const response = await axios.post('http://localhost:5001/api/health/setup', {
        userId,
        weight,
        height,
        age,
        gender,
      });

      console.log('Initial setup data saved:', response.data);
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Error saving initial setup data:', error);
    }
  };

  return (
    <div>
      <h2>Initial Setup</h2>
      <p>Please enter your initial weight.</p>
      {/* Pass the onChange prop */}
      <WeightForm existingWeight={weight} onChange={(value) => setWeight(value)} />

      <p>Please enter your height.</p>
      {/* Pass the onChange prop */}
      <HeightForm existingHeight={height} onChange={(value) => setHeight(value)} />

      <p>Please enter your age.</p>
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />

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

      <button onClick={handleSave}>Save & Continue</button>
    </div>
  );
}

export default InitialSetup;
