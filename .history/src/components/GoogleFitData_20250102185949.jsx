// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const useGoogleFitData = (shouldFetch) => {
//   const [fitData, setFitData] = useState({ steps: 0, calories: 0 });
//   const [error, setError] = useState(null);

//   const fetchGoogleFitData = async () => {
//     try {
//       const tokenResponse = await axios.get('http://localhost:5001/api/googleFit/get-access-token', {
//         withCredentials: true,
//       });
//       // const accessToken = Cookies.get('accessToken');

//       const accessToken = tokenResponse.data.accessToken;
//       console.log('accessToken is:', accessToken)

//       if (!accessToken) {
//         setError('No access token found');
//         return;
//       }

//       const now = new Date();
//       const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
//       const endOfToday = now.getTime();

//       const response = await axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
//         {
//           "aggregateBy": [
//             { "dataTypeName": "com.google.step_count.delta" },
//             { "dataTypeName": "com.google.calories.expended" }
//           ],
//           "bucketByTime": { "durationMillis": 86400000 },
//           "startTimeMillis": startOfToday,
//           "endTimeMillis": endOfToday
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const steps = response.data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal || 0;
//       const calories = response.data.bucket[0]?.dataset[1]?.point[0]?.value[0]?.fpVal || 0;

//       setFitData({ steps, calories });
//     } catch (error) {
//       setError('Error fetching Google Fit data');
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     if (shouldFetch) {
//       fetchGoogleFitData();
//     }
//   }, [shouldFetch]);

//   return { fitData, error, fetchGoogleFitData };
// };

// export default useGoogleFitData;

import { useState, useEffect } from 'react';
import axios from 'axios';

const useGoogleFitData = (shouldFetch) => {
  const [fitData, setFitData] = useState({ steps: 0, calories: 0 });
  const [sessionRoute, setSessionRoute] = useState(null);
  const [error, setError] = useState(null);

  const fetchGoogleFitData = async () => {
    try {
      const tokenResponse = await axios.get('http://localhost:5001/api/googleFit/get-access-token', {
        withCredentials: true,
      });

      const accessToken = tokenResponse.data.accessToken;
      console.log('accessToken is:', accessToken);

      if (!accessToken) {
        setError('No access token found');
        return;
      }

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endOfToday = now.getTime();

      const response = await axios.post(
        'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        {
          aggregateBy: [
            { dataTypeName: 'com.google.step_count.delta' },
            { dataTypeName: 'com.google.calories.expended' },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startOfToday,
          endTimeMillis: endOfToday,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const steps = response.data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal || 0;
      const calories = response.data.bucket[0]?.dataset[1]?.point[0]?.value[0]?.fpVal || 0;

      setFitData({ steps, calories });

      // Fetch session route data
      await fetchSessionRouteData(accessToken);
    } catch (error) {
      setError('Error fetching Google Fit data');
      console.error(error);
    }
  };

  const fetchSessionRouteData = async (accessToken) => {
    try {
      // Fetch sessions to find a specific session (e.g., "Afternoon walk")
      const sessionsResponse = await axios.get('http://localhost:5001/api/googleFit/sessions', {
        params: { accessToken },
      });

      const sessions = sessionsResponse.data;
      console.log('yuval', sessions)
      const afternoonWalk = sessions.find((session) => session.name === 'Evening walk');
      const afternoonBike = sessions.find((session) => session.name === 'Afternoon bike');

      if (!afternoonWalk) {
        console.error('Afternoon walk session not found.');
        return;
      }
      if (!afternoonBike) {
        console.error('Afternoon bike session not found.');
        return;
      }

      // Fetch route data for the Afternoon walk session
      const { id, startTimeMillis, endTimeMillis } = afternoonBike;
      const routeResponse = await axios.get('http://localhost:5001/api/googleFit/session-route', {
        params: { accessToken, sessionId: id, startTimeMillis, endTimeMillis },
      });

      console.log('Route data:', routeResponse.data);
      setSessionRoute(routeResponse.data);
    } catch (error) {
      console.error('Error fetching session route data:', error.response?.data || error.message);
      setError('Error fetching session route data');
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchGoogleFitData();
    }
  }, [shouldFetch]);

  return { fitData, sessionRoute, error, fetchGoogleFitData };
};

export default useGoogleFitData;

