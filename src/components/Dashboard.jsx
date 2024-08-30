import React from 'react';
import HealthMetrics from './HealthMetrics';
import WeightForm from './WeightForm';


function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Your personalized health insights will appear here.</p>
      <HealthMetrics/>
      <WeightForm/>

    </div>
  );
}

export default Dashboard;
