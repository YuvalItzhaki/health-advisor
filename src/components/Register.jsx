import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserActions from "../actions/UserActions";
import { Form, Input, Button, Typography, message, Card } from "antd";

const { Title } = Typography;

function Register() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { name, email, password } = values;
    try {
      const response = await axios.post(
        "http://localhost:5001/api/users/register",
        { name, email, password },
        { withCredentials: true }
      );
      console.log("response from server:", response.data);

      UserActions.updateUser({
        userId: response.data._id,
        name: response.data.name,
        email: response.data.email,
      });

      message.success("Registration successful! Redirecting...");
      navigate("/initial-setup");
    } catch (err) {
      console.error(err);
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "50px auto", padding: "30px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Register
      </Title>
      <Form
        name="register"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default Register;
