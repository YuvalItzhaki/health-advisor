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
        const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime();
        const endOfToday = now.getTime();
    
        const sessions = await fetchSessions(startOfLastWeek, endOfToday);
        if (sessions.length === 0) {
          console.log('No sessions available for the specified time range.');
          return;
        }
    
        const session = sessions[0]; // Use the first session
        const startTimeMillis = parseInt(session.startTimeMillis);
        const endTimeMillis = parseInt(session.endTimeMillis);
    
        // Fetch location data
        const locationPoints = await fetchLocationDataset(startTimeMillis, endTimeMillis);
        setRoute(locationPoints);
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
      

      const fetchLocationDataset = async (startTimeMillis, endTimeMillis) => {
        const url = `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`;
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              aggregateBy: [
                {
                  dataTypeName: 'com.google.location.sample',
                },
              ],
              bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
              startTimeMillis: startTimeMillis,
              endTimeMillis: endTimeMillis,
            }),
          });
      
          if (!response.ok) {
            throw new Error(`Failed to fetch location dataset: ${response.statusText}`);
          }
      
          const data = await response.json();
          console.log('Location Dataset:', data);
      
          // Extract coordinates
          const locationPoints = data.bucket.flatMap(bucket => 
            bucket.dataset.flatMap(dataset =>
              dataset.point.map(point => ({
                lat: point.value[0]?.fpVal, // Latitude
                lng: point.value[1]?.fpVal, // Longitude
              }))
            )
          );
      
          console.log('Extracted Location Points:', locationPoints);
          return locationPoints;
        } catch (error) {
          console.error('Error fetching location dataset:', error);
          return [];
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
