import React, { useState } from 'react';

function WeightForm({ existingWeight = '', onChange }) {
  const [weight, setWeight] = useState(existingWeight);

  const handleWeightChange = (e) => {
    setWeight(e.target.value);  // Update local state
    onChange(e.target.value);   // Pass the updated value to parent
  };

  return (
    <div>
      <label>Weight:</label>
      <input
        type="number"
        value={weight}
        onChange={handleWeightChange}  // Update as user types
        required
      />
    </div>
  );
}

export default WeightForm;
