import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function WeightForm({ weightId = null, existingWeight = '', onSave, onDelete }) {
  const userId = useSelector((state) => state.user.userId); // Access userId from Redux
  const [weight, setWeight] = useState(existingWeight);

  const handleSubmit = async (e) => {
    console.log('userId:', userId)
    e.preventDefault();
    try {
      if (weightId) {
        // Edit existing weight
        const response = await axios.put(`http://localhost:5001/api/health/weight/${weightId}`, { weight });
        onSave(response.data);
      } else {
        // Create new weight
        const response = await axios.post('http://localhost:5001/api/health/weight', { userId, weight });
        onSave(response.data);
      }
      setWeight('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (weightId) {
        await axios.delete(`http://localhost:5001/api/health/weight/${weightId}`);
        onDelete(weightId);
        setWeight('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Weight:
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </label>
      <button type="submit">
        {weightId ? 'Update Weight' : 'Save Weight'}
      </button>
      {weightId && (
        <button type="button" onClick={handleDelete}>
          Delete Weight
        </button>
      )}
    </form>
  );
}

export default WeightForm;
