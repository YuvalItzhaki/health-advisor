import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserActions from "../actions/UserActions";
import GoogleFitButton from "../components/GoogleFitButton";

import { Form, Input, Button, Typography, Card, message } from "antd";

const { Title } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email, password } = values;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email, password }
      );
      const userData = response.data;

      if (userData) {
        localStorage.setItem("authToken", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));

        UserActions.updateUser(userData);
        login(userData); // pass userData to AuthContext

        message.success("Login successful!");
        navigate("/dashboard");
      } else {
        message.error("User data not found in response");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "50px auto", padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Login
      </Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <GoogleFitButton />
      </div>
    </Card>
  );
}

export default Login;
