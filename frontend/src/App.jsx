import React from "react";
import { Routes, Route } from "react-router-dom";
import { useUser } from "./context/UserContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import KYCForm from "./pages/KYCForm.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
  const { user } = useUser();

  return (
    <>
      {/* Navbar included on all pages except NotFound */}
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User-Protected Route */}
        <Route path="/kyc" element={<ProtectedRoute role="user"><KYCForm /></ProtectedRoute>} />

        {/* Admin-Protected Route */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
