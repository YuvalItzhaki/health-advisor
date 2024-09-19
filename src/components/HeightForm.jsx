import React, { useState } from 'react';

function HeightForm({ existingHeight, onChange, showSaveButton }) {
  const [height, setHeight] = useState(existingHeight || '');

  const handleHeightChange = (e) => {
    setHeight(e.target.value);
  };

  const handleSubmit = () => {
    onChange(height);
  };

  let content;

  if (showSaveButton) {
    content = (
      <div>
        <input
          type="number"
          value={height}
          onChange={handleHeightChange}
        />
        <button onClick={handleSubmit}>Save Height</button>
      </div>
    );
  } else {
    content = (
      <div>
        <input
          type="number"
          value={existingHeight || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        {showSaveButton && <button>Save</button>}
      </div>
    );
  }

  return <div>{content}</div>;
  }

export default HeightForm;
