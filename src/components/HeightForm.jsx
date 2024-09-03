// HeightForm.js
import React from 'react';

function HeightForm({ existingHeight = '', onChange }) {
  const handleHeightChange = (e) => {
    onChange(e.target.value); // Pass the updated height back to the parent component
  };

  return (
    <div>
      <label>
        Height:
        <input
          type="number"
          value={existingHeight}
          onChange={handleHeightChange}
          required
        />
      </label>
    </div>
  );
}

export default HeightForm;
