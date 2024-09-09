import React, { useState } from 'react';

function HeightForm({ existingHeight = '', onChange }) {
  const [height, setHeight] = useState(existingHeight);

  const handleHeightChange = (e) => {
    setHeight(e.target.value);   // Update local state
    onChange(e.target.value);    // Pass the updated value to parent
  };

  return (
    <div>
      <label>Height:</label>
      <input
        type="number"
        value={height}
        onChange={handleHeightChange}  // Update as user types
        required
      />
    </div>
  );
}

export default HeightForm;
