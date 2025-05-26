import React, { useState, useEffect } from "react";
import { InputNumber, Button, Space } from "antd";

function WeightForm({ existingWeight, onChange, showSaveButton }) {
  const [weight, setWeight] = useState(existingWeight || "");

  // Sync local weight state if existingWeight prop changes
  useEffect(() => {
    setWeight(existingWeight || "");
  }, [existingWeight]);

  const handleWeightChange = (value) => {
    setWeight(value);
    if (!showSaveButton) {
      // If no save button, update parent immediately on change
      onChange(value);
    }
  };

  const handleSubmit = () => {
    onChange(weight);
  };

  return (
    <Space>
      <InputNumber
        min={0}
        value={weight}
        onChange={handleWeightChange}
        placeholder="Enter weight"
        style={{ width: 120 }}
      />
      {showSaveButton && (
        <Button type="primary" onClick={handleSubmit}>
          Save Weight
        </Button>
      )}
    </Space>
  );
}

export default WeightForm;
