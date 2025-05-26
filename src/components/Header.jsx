import React from "react";
import { Layout, Avatar, Typography, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import logo from "../assets/logo/logo.webp";

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

function Header({ name = "Guest", profilePicture }) {
  return (
    <AntHeader
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Space>
        <img src={logo} alt="App Logo" style={{ height: "40px" }} />
        <Title level={4} style={{ margin: 0 }}>
          User Dashboard
        </Title>
      </Space>

      <Space>
        <Text strong>Welcome, {name || "Guest"}!</Text>
        <Avatar
          size="large"
          src={profilePicture}
          icon={<UserOutlined />}
          style={{ cursor: "pointer" }}
        />
      </Space>
    </AntHeader>
  );
}

export default Header;
