import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const googleFitData = () => {
  const [fitData, setFitData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoogleFitData = async () => {
      try {
        // First, fetch the access token from the backend (this would involve the server retrieving it from the database)
        const tokenResponse = await axios.get('http://localhost:5001/api/health/get-access-token', {
          withCredentials: true,  
        }); // Endpoint to retrieve the Google access token
        
        const accessToken = tokenResponse.data.accessToken; // Assuming the backend responds with { accessToken: '...' }
        console.log('accessToken is:', accessToken);

        if (!accessToken) {
          setError('No access token found');
          return;
        }

        // Use the retrieved access token to fetch Google Fit data
        const response = await axios.get('http://localhost:5001/api/health/google-fit-data', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          params: {
            "aggregateBy": [{
              "dataTypeName": "com.google.step_count.delta",
              "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas" // Include data source ID

            }],
            "bucketByTime": { "durationMillis": 86400000 },
            "startTimeMillis": new Date('2024-01-01').getTime(),
            "endTimeMillis": new Date().getTime()
          },
          withCredentials: true, // Include this to send cookies with the request
        });
        
        console.log('response.data:', response.data);
        setFitData(response.data); // Assuming you have state for fitData
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
