import React, { useState } from 'react';

function WeightForm({ existingWeight, onChange }) {
  const [weight, setWeight] = useState(existingWeight || '');

  const handleWeightChange = (e) => {
    setWeight(e.target.value); // Only update the local state
  };

  const handleSubmit = () => {
    onChange(weight); // Call the save function only when user clicks "Save"
  };

  return (
    <div>
      <input
        type="number"
        value={weight}
        onChange={handleWeightChange}
      />
      <button onClick={handleSubmit}>Save Weight</button>
    </div>
  );
}

export default WeightForm;
