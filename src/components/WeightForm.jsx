import React, { useState } from 'react';

function WeightForm({ existingWeight, onChange, showSaveButton }) {
  const [weight, setWeight] = useState(existingWeight || '');

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleSubmit = () => {
    onChange(weight);
  };

  let content;

  if (showSaveButton) {
    content = (
      <div>
        <input
          type="number"
          value={weight}
          onChange={handleWeightChange}
        />
        <button onClick={handleSubmit}>Save Weight</button>
      </div>
    );
  } else {
    content = (
      <div>
        <input
          type="number"
          value={existingWeight || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        {showSaveButton && <button>Save</button>}
      </div>
    );
  }

  return <div>{content}</div>;
  }

export default WeightForm;
