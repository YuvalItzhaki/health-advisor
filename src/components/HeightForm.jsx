import React, { useState, useEffect } from "react";
import { InputNumber, Button, Space } from "antd";

function HeightForm({ existingHeight, onChange, showSaveButton }) {
  const [height, setHeight] = useState(existingHeight || "");

  // Sync local height state if existingHeight prop changes
  useEffect(() => {
    setHeight(existingHeight || "");
  }, [existingHeight]);

  const handleHeightChange = (value) => {
    setHeight(value);
    if (!showSaveButton) {
      // If no save button, update parent immediately on change
      onChange(value);
    }
  };

  const handleSubmit = () => {
    onChange(height);
  };

  return (
    <Space>
      <InputNumber
        min={0}
        value={height}
        onChange={handleHeightChange}
        placeholder="Enter height"
        style={{ width: 150 }}
      />
      {showSaveButton && (
        <Button type="primary" onClick={handleSubmit}>
          Save Height
        </Button>
      )}
    </Space>
  );
}

export default HeightForm;
