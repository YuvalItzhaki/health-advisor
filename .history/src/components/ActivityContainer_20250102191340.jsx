import React, { useEffect, useState } from 'react';
import ActivityMap from './ActivityMap';
import axios from 'axios';
import Cookies from 'js-cookie';

const ActivityContainer = () => {
  const [route, setRoute] = useState([]);
  const [accessToken, setAccessToken] = useState(Cookies.get('accessToken')); // Manage token state

  // Fetch or refresh access token
  useEffect(() => {
    if (!accessToken) {
      console.log('Access token is missing, fetching again...');
      axios.get('http://localhost:5001/api/googleFit/get-access-token', { withCredentials: true })
        .then((response) => {
          const token = response.data.accessToken;
          if (token) {
            Cookies.set('accessToken', token, { expires: 1, secure: true });
            setAccessToken(token);
          }
        })
        .catch((error) => console.error('Error fetching access token:', error));
    }
  }, [accessToken]);

  // Fetch route data
  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const now = new Date();
        const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime(); // 7 days ago
        const endOfToday = now.getTime(); // Current time

        // Step 1: Fetch sessions
        const sessions = await fetchSessions(startOfLastWeek, endOfToday);
        if (sessions.length === 0) {
          console.log('No sessions available for the specified time range.');
          return;
        }

        // Step 2: Use the first session (customize logic if needed)
        const session = sessions[0];
        const sessionId = session.id;
        const startTimeMillis = Date.parse(session.startTime);
        const endTimeMillis = Date.parse(session.endTime);

        // Step 3: Fetch location data for the session
        await fetchLocationData(sessionId, startTimeMillis, endTimeMillis);
      } catch (error) {
        console.error('Error fetching route data:', error);
      }
    };

    // Helper: Fetch sessions from Google Fit
    const fetchSessions = async (startTimeMillis, endTimeMillis) => {
        const url = `https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${new Date(startTimeMillis).toISOString()}&endTime=${new Date(endTimeMillis).toISOString()}`;
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error(`Failed to fetch sessions: ${response.statusText}`);
          }
      
          const data = await response.json();
          console.log('Fetched Sessions:', data);
          return data.session || [];
        } catch (error) {
          console.error('Error fetching sessions:', error);
          return [];
        }
      };
      

    // Helper: Fetch location data and transform route coordinates
    const fetchLocationData = async (sessionId, startTimeMillis, endTimeMillis) => {
      try {
        const response = await axios.post(
          'http://localhost:5001/api/googleFit/fetch-location-data',
          { sessionId, startTimeMillis, endTimeMillis },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const locationPoints = response.data.locationPoints || [];
        console.log('Raw Location Points:', locationPoints);

        const formattedRoute = locationPoints
          .filter(point => point.latitude !== undefined && point.longitude !== undefined) // Filter out invalid points
          .map(point => ({
            lat: parseFloat(point.latitude), // Ensure lat is a number
            lng: parseFloat(point.longitude), // Ensure lng is a number
          }))
          .filter(point => !isNaN(point.lat) && !isNaN(point.lng)); // Filter out NaN values

        console.log('Formatted Route:', formattedRoute);
        setRoute(formattedRoute);
      } catch (error) {
        console.error('Error fetching location data:', error.response?.data || error.message);
      }
    };

    if (accessToken) {
      fetchRouteData();
    }
  }, [accessToken]);

  return (
    <div>
      <h2>Your Activity Route</h2>
      <ActivityMap route={route} />
    </div>
  );
};

export default ActivityContainer;
