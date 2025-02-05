import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import apiService from "../utils/apiService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Validate JWT Token
  const isValidToken = async (token) => {
    try {
      const data = await apiService.post("/auth/session");

      if (data?.user?.token === token) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: "Invalid token received" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };


  // Load user session from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (isValidToken(parsedUser.token)) {
        setUser(parsedUser);
      } else {
        logout();
      }
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const data = await apiService.post("/auth/login", credentials);
      if (data.user.token) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: "Invalid token received" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// PropTypes Validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContext;
