import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import {
  HomeOutlined,
  DashboardOutlined,
  LoginOutlined,
  UserAddOutlined,
  SettingOutlined,
  CarryOutOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import InitialSetup from "./components/InitialSetup";
import ActivityContainer from "./components/ActivityContainer";
import { AuthProvider, useAuth } from "./context/AuthContext";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout style={{ minHeight: "100vh" }}>
          <Header>
            <div
              className="logo"
              style={{
                float: "left",
                color: "#fff",
                fontSize: "20px",
                marginRight: "20px",
              }}
            >
              Health Adviser
            </div>
            <MainMenu />
          </Header>
          <Content style={{ padding: "0 50px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Health Adviser</Breadcrumb.Item>
              <Breadcrumb.Item>Page</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/activity" element={<ActivityContainer />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/initial-setup" element={<InitialSetup />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Health Adviser ©2025 Created with Ant Design
          </Footer>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

function MainMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Menu theme="dark" mode="horizontal" selectable={false}>
      <Menu.Item key="1" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<DashboardOutlined />}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<CarryOutOutlined />}>
        <Link to="/activity">Activity</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<UserAddOutlined />}>
        <Link to="/register">Register</Link>
      </Menu.Item>
      <Menu.Item key="5" icon={<SettingOutlined />}>
        <Link to="/initial-setup">Setup</Link>
      </Menu.Item>
      {!user ? (
        <Menu.Item key="6" icon={<LoginOutlined />}>
          <Link to="/login">Login</Link>
        </Menu.Item>
      ) : (
        <Menu.Item key="7" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      )}
    </Menu>
  );
}

export default App;
