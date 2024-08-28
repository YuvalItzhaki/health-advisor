import React from 'react';

function HealthMetrics() {
  // For now, mock some health data
  const metrics = {
    steps: 12000,
    calories: 1800,
    sleep: 7.5,
  };

  return (
    <div>
      <h3>Your Health Metrics</h3>
      <ul>
        <li>Steps: {metrics.steps}</li>
        <li>Calories: {metrics.calories}</li>
        <li>Sleep: {metrics.sleep} hours</li>
      </ul>
    </div>
  );
}

export default HealthMetrics;
