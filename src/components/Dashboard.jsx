import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Layout, Card, Row, Col, Typography, Button, message } from "antd";
import WeightForm from "./WeightForm";
import HeightForm from "./HeightForm";
import Header from "./Header";
import HealthMetrics from "./HealthMetrics";
import userStoreInstance from "../stores/UserStore";
import HealthHistory from "./HealthHistory";
import Cookies from "js-cookie";
import useGoogleFitData from "./GoogleFitData";
import ActivityMap from "./ActivityMap";
import ActivityContainer from "./ActivityContainer";

const { Title, Text } = Typography;
const { Content } = Layout;

function Dashboard() {
  const [weights, setWeights] = useState([]);
  const [heights, setHeights] = useState([]);
  const navigate = useNavigate();
  const { fitData, error, fetchGoogleFitData } = useGoogleFitData();
  const [activityLocation, setActivityLocation] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userFromStore = userStoreInstance.getUser();
    const storedUserId =
      userFromStore?.userId || storedUser?._id || storedUser?.userId || null;
    const googleIdFromCookies = Cookies.get("googleId");
    const authToken =
      localStorage.getItem("authToken") || Cookies.get("authToken");

    if (!authToken) {
      message.warning("No auth token, redirecting to login.");
      navigate("/login");
      return;
    }

    if (googleIdFromCookies) {
      fetchHealthData(`google/${googleIdFromCookies}`, authToken);
      fetchGoogleFitData();
    } else if (storedUserId) {
      fetchHealthData(`user/${storedUserId}`, authToken);
    } else {
      message.warning("No user ID or Google ID, redirecting to login.");
      navigate("/login");
    }
  }, [navigate]);

  const fetchHealthData = (apiPath, authToken) => {
    axios
      .get(`http://localhost:5001/api/health/${apiPath}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        const healthData = response.data;
        setWeights(healthData.weights || []);
        setHeights(healthData.heights || []);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          message.info("No health data found, redirecting to initial setup.");
          navigate("/initial-setup");
        } else {
          message.error("Error fetching health data.");
          console.error("Error fetching health data:", error);
        }
      });
  };

  const getUserIdOrGoogleId = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userFromStore = userStoreInstance.getUser();
    const storedUserId =
      userFromStore?.userId || storedUser?._id || storedUser?.userId || null;
    const googleIdFromCookies = Cookies.get("googleId");
    return storedUserId || googleIdFromCookies;
  };

  const handleWeightSave = (newWeight) => {
    const id = getUserIdOrGoogleId();

    axios
      .put(`http://localhost:5001/api/health/update/weights/${id}`, {
        value: { value: newWeight, date: new Date() },
      })
      .then((response) => {
        message.success("Weight updated.");
        const updatedWeight = { value: newWeight, date: new Date() };
        setWeights([...weights, updatedWeight]);
      })
      .catch((error) => {
        message.error("Error updating weight.");
        console.error("Error updating weight:", error);
      });
  };

  const handleHeightSave = (newHeight) => {
    const id = getUserIdOrGoogleId();

    axios
      .put(`http://localhost:5001/api/health/update/heights/${id}`, {
        value: { value: newHeight, date: new Date() },
      })
      .then((response) => {
        message.success("Height updated.");
        const updatedHeight = { value: newHeight, date: new Date() };
        setHeights([...heights, updatedHeight]);
      })
      .catch((error) => {
        message.error("Error updating height.");
        console.error("Error updating height:", error);
      });
  };

  const handleRefreshData = () => {
    message.info("Refreshing Google Fit data...");
    fetchGoogleFitData();
  };

  return (
    <Layout style={{ padding: "24px" }}>
      <Header userName={userStoreInstance.getUser()?.name} />
      <Content>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card
              title={<Title level={4}>Your Health Metrics</Title>}
              bordered={false}
            >
              <HealthMetrics weights={weights} heights={heights} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              title={<Title level={4}>Edit Your Health Data</Title>}
              bordered={false}
            >
              <Title level={5}>Weight</Title>
              <WeightForm onChange={handleWeightSave} showSaveButton={true} />
              <Title level={5}>Height</Title>
              <HeightForm onChange={handleHeightSave} showSaveButton={true} />
            </Card>
          </Col>
        </Row>

        {Cookies.get("googleId") && (
          <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
            <Col xs={24} md={12}>
              <Card
                title={<Title level={4}>Google Fit Data</Title>}
                bordered={false}
              >
                {error && <Text type="danger">{error}</Text>}
                <p>
                  Steps:{" "}
                  {fitData.steps > 0
                    ? fitData.steps
                    : "No steps data available."}
                </p>
                <p>
                  Calories:{" "}
                  {fitData.calories > 0
                    ? fitData.calories.toFixed(2)
                    : "No calories data available."}
                </p>
                <Button type="primary" onClick={handleRefreshData}>
                  Refresh Data
                </Button>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title={<Title level={4}>Activity Map</Title>}
                bordered={false}
              >
                <ActivityContainer />
                <ActivityMap activityLocation={activityLocation} />
              </Card>
            </Col>
          </Row>
        )}

        <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
          <Col span={24}>
            <Card
              title={<Title level={4}>Health History</Title>}
              bordered={false}
            >
              <HealthHistory />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Dashboard;
