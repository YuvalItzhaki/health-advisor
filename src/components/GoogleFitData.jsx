import { useState, useEffect } from "react";
import axios from "axios";
import { message, notification } from "antd";

const useGoogleFitData = (shouldFetch) => {
  const [fitData, setFitData] = useState({ steps: 0, calories: 0 });
  const [sessionRoute, setSessionRoute] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGoogleFitData = async () => {
    setLoading(true);
    try {
      const tokenResponse = await axios.get(
        "http://localhost:5001/api/googleFit/get-access-token",
        {
          withCredentials: true,
        }
      );

      const accessToken = tokenResponse.data.accessToken;

      if (!accessToken) {
        setError("No access token found");
        message.error("No access token found. Please log in again.");
        setLoading(false);
        return;
      }

      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).getTime();
      const endOfToday = now.getTime();

      const response = await axios.post(
        "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        {
          aggregateBy: [
            { dataTypeName: "com.google.step_count.delta" },
            { dataTypeName: "com.google.calories.expended" },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startOfToday,
          endTimeMillis: endOfToday,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const steps =
        response.data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal || 0;
      const calories =
        response.data.bucket[0]?.dataset[1]?.point[0]?.value[0]?.fpVal || 0;

      setFitData({ steps, calories });
      message.success("Fetched Google Fit data successfully");

      // Fetch session route data
      await fetchSessionRouteData(accessToken);
    } catch (err) {
      console.error("Error fetching Google Fit data:", err);
      setError("Error fetching Google Fit data");
      message.error("Failed to fetch Google Fit data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionRouteData = async (accessToken) => {
    try {
      const sessionsResponse = await axios.get(
        "http://localhost:5001/api/googleFit/sessions",
        {
          params: { accessToken },
        }
      );

      const sessions = sessionsResponse.data.session || [];

      if (!Array.isArray(sessions)) {
        console.error("Sessions data is not an array:", sessionsResponse.data);
        setError("Error fetching session data: Sessions data is not an array.");
        message.error("Session data format error");
        return;
      }

      if (sessions.length === 0) {
        notification.info({
          message: "No Sessions Found",
          description:
            "No Google Fit walking or cycling sessions found for the last month.",
        });
        setError("No sessions found for the last month.");
        return;
      }

      const walkingSession = sessions.find(
        (session) => session.activityType === "walking"
      );
      const cyclingSession = sessions.find(
        (session) => session.activityType === "cycling"
      );

      if (!walkingSession && !cyclingSession) {
        notification.warning({
          message: "No Walking or Cycling Data",
          description:
            "No walking or cycling sessions were found in your Google Fit data.",
        });
        setError("No walking or cycling sessions found.");
        return;
      }

      const selectedSession = walkingSession || cyclingSession;
      const { id, startTimeMillis, endTimeMillis } = selectedSession;

      const routeResponse = await axios.get(
        "http://localhost:5001/api/googleFit/session-route",
        {
          params: {
            accessToken,
            sessionId: id,
            startTimeMillis,
            endTimeMillis,
          },
        }
      );

      setSessionRoute(routeResponse.data);
      message.success("Fetched session route data successfully");
    } catch (err) {
      console.error(
        "Error fetching session route data:",
        err.response?.data || err.message
      );
      setError("Error fetching session route data");
      message.error("Failed to fetch session route data");
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchGoogleFitData();
    }
  }, [shouldFetch]);

  return { fitData, sessionRoute, error, loading, fetchGoogleFitData };
};

export default useGoogleFitData;
