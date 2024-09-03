// WeightForm.js
import React from 'react';

function WeightForm({ existingWeight = '', onChange }) {
  const handleWeightChange = (e) => {
    onChange(e.target.value); // Pass the updated weight back to the parent component
  };

  return (
    <div>
      <label>
        Weight:
        <input
          type="number"
          value={existingWeight}
          onChange={handleWeightChange}
          required
        />
      </label>
    </div>
  );
}

export default WeightForm;
