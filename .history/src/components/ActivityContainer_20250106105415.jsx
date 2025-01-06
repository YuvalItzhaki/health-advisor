import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ActivityMap from './ActivityMap';

const ActivityContainer = () => {
  const [route, setRoute] = useState([]);
  const [accessToken, setAccessToken] = useState(Cookies.get('accessToken'));

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

  // Fetch route data for the most recent session from last month
  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).getTime();
        const lastMonthEnd = today.getTime(); 

        // Fetch sessions from Google Fit (modified)
        const sessions = await fetchSessions(lastMonthStart, lastMonthEnd);

        if (sessions.length === 0) {
          console.log('sessions:', sessions)
          console.log('No sessions found for the last month.');
          return;
        }

        // Get the most recent session
        const mostRecentSession = sessions.reduce((a, b) => (a.startTimeMillis > b.startTimeMillis ? a : b));
        const sessionId = mostRecentSession.id.split(':')[0]; 
        const startTimeMillis = mostRecentSession.startTimeMillis;
        const endTimeMillis = mostRecentSession.endTimeMillis;

        await fetchLocationData(sessionId, startTimeMillis, endTimeMillis);
      } catch (error) {
        console.error('Error fetching route data:', error.response?.data || error.message);
      }
    };

    // Helper: Fetch sessions from Google Fit (modified)
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
        // Assuming sessions are returned directly (no "session" property needed)
        const sessions = Array.isArray(data) ? data : []; 
        return sessions;
      } catch (error) {
        console.error('Error fetching sessions:', error);
        return [];
      }
    };

    // Helper: Fetch location data for the specified session
    const fetchLocationData = async (sessionId, startTimeMillis, endTimeMillis) => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/googleFit/session-route?sessionId=${sessionId}&startTimeMillis=${startTimeMillis}&endTimeMillis=${endTimeMillis}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const locationPoints = response.data.locationPoints || [];

        const formattedRoute = locationPoints
          .filter(point => point.latitude !== undefined && point.longitude !== undefined) 
          .map(point => ({
            lat: parseFloat(point.latitude),
            lng: parseFloat(point.longitude),
          }))
          .filter(point => !isNaN(point.lat) && !isNaN(point.lng));

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