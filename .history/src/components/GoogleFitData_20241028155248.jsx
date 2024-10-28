import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const useGoogleFitData = (shouldFetch) => {
  const [fitData, setFitData] = useState({ steps: 0, calories: 0 });
  const [error, setError] = useState(null);

  const fetchGoogleFitData = async () => {
    try {
      const tokenResponse = await axios.get('http://localhost:5001/api/googleFit/get-access-token', {
        withCredentials: true,
      });

      const accessToken = tokenResponse.data.accessToken;

      if (!accessToken) {
        setError('No access token found');
        return;
      }

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfToday = now.getTime();

      const response = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        {
          "aggregateBy": [
            { "dataTypeName": "com.google.step_count.delta" },
            { "dataTypeName": "com.google.calories.expended" }
          ],
          "bucketByTime": { "durationMillis": 86400000 },
          "startTimeMillis": startOfToday,
          "endTimeMillis": endOfToday
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const steps = response.data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal || 0;
      const calories = response.data.bucket[0]?.dataset[1]?.point[0]?.value[0]?.fpVal || 0;

      setFitData({ steps, calories });
    } catch (error) {
      setError('Error fetching Google Fit data');
      console.error(error);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchGoogleFitData();
    }
  }, [shouldFetch]);

  return { fitData, error, fetchGoogleFitData };
};

export default useGoogleFitData;
