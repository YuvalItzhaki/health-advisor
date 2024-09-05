import React, { useState } from 'react';

function HeightForm({ existingHeight = '', onChange }) {
  const [height, setHeight] = useState(existingHeight); // Local state for the input field

  const handleHeightChange = (e) => {
    setHeight(e.target.value); // Update the local state as the user types
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    onChange(height); // Call onSave only when the user submits the form
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Height:
        <input
          type="number"
          value={height}
          onChange={handleHeightChange} // Update the input value on change
          required
        />
      </label>
      <button type="submit">Save</button> {/* Submit button to trigger onSave */}
    </form>
  );
}

export default HeightForm;
