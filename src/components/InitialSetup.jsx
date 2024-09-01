import React from 'react';
import WeightForm from './WeightForm';
import { useNavigate } from 'react-router-dom';


function InitialSetup() {
    const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div>
      <h2>Initial Setup</h2>
      <p>Please enter your initial weight to get started.</p>
      <WeightForm onSave={() => navigate('/dashboard')} />
    </div>
  );
}

export default InitialSetup;
