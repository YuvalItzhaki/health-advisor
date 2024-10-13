import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const GoogleFitData = () => {
  const [fitData, setFitData] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch Google Fit Steps data using the access token
  const fetchGoogleFitSteps = async (accessToken) => {
    try {
      const response = await axios.get('http://localhost:5001/api/health/google-fit-data', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          "aggregateBy": [{
            "dataTypeName": "com.google.step_count.delta"
          }],
          "bucketByTime": { "durationMillis": 86400000 }, // Daily buckets
          "startTimeMillis": new Date('2024-01-01').getTime(), // Example start date
          "endTimeMillis": new Date().getTime() // Current date
        },
        withCredentials: true, // Send cookies with the request
      });

      console.log('response.data:', response.data);
      setFitData(response.data.bucket || []); // Ensure fitData is an array
    } catch (error) {
      setError('Error fetching Google Fit data');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchGoogleFitData = async () => {
      try {
        // Fetch the access token from the backend
        const tokenResponse = await axios.get('http://localhost:5001/api/health/get-access-token', {
          withCredentials: true, // Send cookies with the request
        });

        const accessToken = tokenResponse.data.accessToken;
        console.log('accessToken is:', accessToken);

        if (!accessToken) {
          setError('No access token found');
          return;
        }

        // Fetch Google Fit steps using the retrieved access token
        await fetchGoogleFitSteps(accessToken);
      } catch (error) {
        setError('Error fetching Google Fit data');
        console.error(error);
      }
    };

    fetchGoogleFitData();
  }, []);

  return (
    <div>
      <h2>Google Fit Steps Data</h2>
      {error && <p>{error}</p>}
      {Array.isArray(fitData) && fitData.length > 0 ? (
        <ul>
          {fitData.map((bucket, index) => (
            <li key={index}>
              Steps: {bucket.dataset[0]?.point[0]?.value[0]?.intVal || 'N/A'}, 
              Time: {new Date(parseInt(bucket.startTimeMillis)).toLocaleDateString()} - {new Date(parseInt(bucket.endTimeMillis)).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No steps data available.</p>
      )}
    </div>
  );
};

export default GoogleFitData;
