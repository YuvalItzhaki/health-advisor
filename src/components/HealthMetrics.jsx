import React, { useEffect, useState } from "react";
import axios from "axios";
import userStoreInstance from "../stores/UserStore";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Card, Statistic, Spin, Typography, Row, Col, message } from "antd";

const { Title, Text } = Typography;

function HealthMetrics() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId =
    userStoreInstance.getUser()?.userId || (storedUser ? storedUser._id : null);
  const googleId = Cookies.get("googleId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const token =
          localStorage.getItem("authToken") || Cookies.get("authToken");

        if (!token) {
          message.error("No token found. Redirecting to login...");
          navigate("/login");
          return;
        }

        const apiPath = googleId ? `google/${googleId}` : `user/${userId}`;
        const response = await axios.get(
          `http://localhost:5001/api/health/${apiPath}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          setHealthData(response.data);
        } else {
          message.info("No health data found, redirecting to initial setup.");
          navigate("/initial-setup");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          message.info("No health data found, redirecting to initial setup.");
          navigate("/initial-setup");
        } else {
          message.error("Error fetching health data.");
          console.error("Error fetching health data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId || googleId) {
      fetchHealthData();
    }
  }, [userId, googleId, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spin tip="Loading health data..." size="large" />
      </div>
    );
  }

  if (!healthData) {
    return null; // or fallback UI if needed
  }

  const weights = healthData.weights || [];
  const heights = healthData.heights || [];
  const latestWeight = weights.length
    ? weights[weights.length - 1].value
    : "No data";
  const latestHeight = heights.length
    ? heights[heights.length - 1].value
    : "No data";

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={3}>Your Health Data</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Current Weight (KG)" value={latestWeight} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Current Height (CM)" value={latestHeight} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Age" value={healthData.age || "No data"} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Gender" value={healthData.gender || "No data"} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HealthMetrics;
