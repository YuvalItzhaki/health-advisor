import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const googleFitData = () => {
  const [fitData, setFitData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoogleFitData = async () => {
      try {
        const response = await axios.get('/api/google-fit-data'); // Call your server route
        setFitData(response.data);
      } catch (error) {
        setError('Error fetching Google Fit data');
        console.error('Error fetching Google Fit data:', error);
      }
    };

    fetchGoogleFitData();
  }, []);

  return { fitData, error };
};

export default googleFitData;
