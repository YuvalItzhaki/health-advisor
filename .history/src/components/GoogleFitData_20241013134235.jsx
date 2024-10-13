import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const googleFitData = () => {
  const [fitData, setFitData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoogleFitData = async () => {
        try {
          // Fetch the access token from the backend
          const tokenResponse = await axios.get('http://localhost:5001/api/health/get-access-token', {
            withCredentials: true,
          }); 
          
          const accessToken = tokenResponse.data.accessToken;
          console.log('accessToken is:', accessToken);
      
          if (!accessToken) {
            setError('No access token found');
            return;
          }
      
          // Use the access token to fetch Google Fit data with a POST request
          const response = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', 
            {
              "aggregateBy": [{
                "dataTypeName": "com.google.step_count.delta"
              }],
              "bucketByTime": { "durationMillis": 86400000 }, // Aggregating data by day
              "startTimeMillis": new Date('2024-01-01').getTime(), // Replace with your start date
              "endTimeMillis": new Date().getTime() // Current time
            }, 
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
      
          console.log('response.data:', response.data);
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
