import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Alert } from "@mui/material";
import apiService from "../utils/apiService";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKPIStats = async () => {
      try {
        const data = await apiService.get("/stats");
        setKpiData(data);
      } catch (err) {
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };
    fetchKPIStats();
  }, []);

  return (
    <>
      <Container maxWidth="md">
        <Box mt={5} p={3} boxShadow={3} borderRadius={2} bgcolor="white" textAlign="center">
          <Typography variant="h4" mb={3}>Welcome to the KYC Management System</Typography>
          {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
            <Box display="flex" justifyContent="space-around">
              <Typography variant="h6">Total Users: {kpiData.totalUsers}</Typography>
            </Box>
          )}
        </Box>
      </Container>
    </>

  );
};

export default Home;
