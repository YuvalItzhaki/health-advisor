import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const googleFitData = () => {
  const [fitData, setFitData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoogleFitData = async () => {
      const accessToken = Cookies.get('authToken'); // or localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }

      try {
        const response = await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          params: {
            "aggregateBy": [{
              "dataTypeName": "com.google.step_count.delta"
            }],
            "bucketByTime": { "durationMillis": 86400000 },
            "startTimeMillis": new Date('2024-01-01').getTime(),
            "endTimeMillis": new Date().getTime()
          }
        });
        setFitData(response.data);
      } catch (error) {
        setError('Error fetching Google Fit data');
        console.error(error);
      }
    };

    fetchGoogleFitData();
  }, []);

  return { fitData, error };
};

export default googleFitData;
