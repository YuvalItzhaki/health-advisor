import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const useGoogleFitData = () => {
  const [fitData, setFitData] = useState({ steps: 0, calories: 0 });
  const [error, setError] = useState(null);

  const fetchGoogleFitData = async () => {
    try {
      // Fetch the access token from the backend
      const tokenResponse = await axios.get('http://localhost:5001/api/googleFit/get-access-token', {
        withCredentials: true,
      });

      const accessToken = tokenResponse.data.accessToken;

      if (!accessToken) {
        setError('No access token found');
        return;
      }

      // Adjust the time range to today
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfToday = now.getTime();

      // Use the access token to fetch Google Fit data with a POST request
      const response = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        {
          "aggregateBy": [
            {
              "dataTypeName": "com.google.step_count.delta"
            },
            {
              "dataTypeName": "com.google.calories.expended"
            }
          ],
          "bucketByTime": { "durationMillis": 86400000 }, // Aggregating data by day
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

      // Extract steps and calories data
      const steps = response.data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal || 0;
      const calories = response.data.bucket[0]?.dataset[1]?.point[0]?.value[0]?.fpVal || 0; // Change index to 0 for bucket

      setFitData({ steps, calories });

    } catch (error) {
      setError('Error fetching Google Fit data');
      console.error(error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchGoogleFitData();
  }, []);

  return { fitData, error, fetchGoogleFitData }; // Return the function to allow manual fetching
};

export default useGoogleFitData;
