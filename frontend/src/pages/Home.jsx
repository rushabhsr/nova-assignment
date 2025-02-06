import { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Alert, Grid, Paper } from "@mui/material";
import apiService from "../utils/apiService";

const colorMap = {
  "Approved": "success.main",
  "Rejected": "error.main",
  "Pending for Verification": "warning.main",
  "Pending for Submission": "warning.main",
  "Total Registered Users": "primary.main",
  "Total Users Submitted KYC": "primary.main"
};

const Home = () => {
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKPIStats = async () => {
      try {
        const response = await apiService.get("/kyc/stats");
        setKpiData(response.data); // Assuming response.data is an array of KPI objects
      } catch (err) {
        console.error(err);
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };
    fetchKPIStats();
  }, []);

  return (
    <Container maxWidth="md">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2} bgcolor="white" textAlign="center">
        <Typography variant="h4" mb={3}>Welcome to the KYC Management System</Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {kpiData.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6">{item.label}</Typography>
                  <Typography variant="h5" color={colorMap[item.label] || "text.primary"}>
                    {item.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Home;
