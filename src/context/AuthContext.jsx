import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      // check backend for Google session
      const fetchCurrentUser = async () => {
        try {
          const res = await axios.get("http://localhost:5001/api/auth/me", {
            withCredentials: true,
          });
          if (res.data) {
            setUser(res.data);
            console.log("Authenticated user from backend:", res.data);
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.log("No authenticated user from backend");
        }
      };

      fetchCurrentUser();
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // optionally: also tell backend to clear cookie
    axios
      .post(
        "http://localhost:5001/api/auth/logout",
        {},
        { withCredentials: true }
      )
      .catch((err) => console.error("Logout error:", err));

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
