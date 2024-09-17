import React, { useState } from 'react';

function HeightForm({ existingHeight, onChange }) {
  const [height, setHeight] = useState(existingHeight || '');

  const handleHeightChange = (e) => {
    setHeight(e.target.value); // Only update the local state
  };

  const handleSubmit = () => {
    onChange(height); // Call the save function only when user clicks "Save"
  };

  return (
    <div>
      <input
        type="number"
        value={height}
        onChange={handleHeightChange}
      />
      <button onClick={handleSubmit}>Save Height</button>
    </div>
  );
}

export default HeightForm;
