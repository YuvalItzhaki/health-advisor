import React, { useState } from 'react';

function WeightForm({ existingWeight = '', onChange }) {
  const [weight, setWeight] = useState(existingWeight); // Local state for the input field

  const handleWeightChange = (e) => {
    setWeight(e.target.value); // Update the local state as the user types
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    onChange(weight); // Call onSave only when the user submits the form
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Weight:
        <input
          type="number"
          value={weight}
          onChange={handleWeightChange} // Update the input value on change
          required
        />
      </label>
      <button type="submit">Save</button> {/* Submit button to trigger onSave */}
    </form>
  );
}

export default WeightForm;
