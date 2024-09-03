import React, { useEffect, useState } from 'react';
import axios from 'axios';

import WeightForm from './WeightForm';
import HeightForm from './HeightForm';
import Header from './Header';

function Dashboard() {
  const [weights, setWeights] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState(null);



  const handleSave = (newData) => {
    // Logic to update the state with newData (could include weight, height, etc.)
    setWeights([...weights, newData.weight]);
    // Update other states for height, age, etc.
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Weight</h3>
          <WeightForm 
            weightId={selectedWeight ? selectedWeight._id : null} 
            existingWeight={selectedWeight ? selectedWeight.weight : ''} 
            onSave={handleSave}
          />
        </div>
        <div className="metric-card">
          <h3>Height</h3>
          <HeightForm 
            // Similar logic as WeightForm for handling height
            onSave={handleSave}
          />
        </div>
        {/* Add more metric cards as needed */}
      </div>
      <button>Save All</button>
    </div>
  );
}

export default Dashboard;
