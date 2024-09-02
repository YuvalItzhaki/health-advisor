import React, { useState } from 'react';
import HealthMetrics from './HealthMetrics';
import WeightForm from './WeightForm';

function Dashboard() {
  const [weights, setWeights] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState(null);

  const handleSave = (newWeight) => {
    setWeights([...weights, newWeight]);
  };

  const handleWeightSelect = (weight) => {
    setSelectedWeight(weight);
  };
  const handleDelete = (weightId) => {
    setWeights(weights.filter((weight) => weight._id !== weightId));
    setSelectedWeight(null);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Your personalized health insights will appear here.</p>
      <HealthMetrics onSelectWeight={handleWeightSelect} />
      <WeightForm 
        weightId={selectedWeight ? selectedWeight._id : null} 
        existingWeight={selectedWeight ? selectedWeight.weight : ''} 
        onSave={handleSave} 
        onDelete={handleDelete} 
      />
    </div>
  );
}

export default Dashboard;
