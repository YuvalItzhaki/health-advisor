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
      // Fetch sessions
      const sessionsResponse = await axios.get('http://localhost:5001/api/googleFit/sessions', {
        params: { accessToken },
      });
  
      const sessions = sessionsResponse.data.session || []; 
  
      if (!Array.isArray(sessions)) {
        console.error('Sessions data is not an array:', sessionsResponse.data);
        setError('Error fetching session data: Sessions data is not an array.');
        return;
      }
  
      if (sessions.length === 0) {
        console.log('No sessions found for the last month.');
        setError('No sessions found for the last month.');
        return;
      }
  
      // Find a specific session (e.g., "Walking" or "Cycling")
      const walkingSession = sessions.find((session) => session.activityType === 'walking');
      const cyclingSession = sessions.find((session) => session.activityType === 'cycling');
  
      if (!walkingSession && !cyclingSession) {
        console.log('No walking or cycling sessions found.');
        setError('No walking or cycling sessions found.');
        return;
      }
  
      const selectedSession = walkingSession || cyclingSession; 
      const { id, startTimeMillis, endTimeMillis } = selectedSession;
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

