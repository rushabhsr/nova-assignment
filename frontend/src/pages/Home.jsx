import { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Alert, Grid2 as Grid, Paper } from "@mui/material";
import apiService from "../utils/apiService";

const Home = () => {
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKPIStats = async () => {
      try {
        const response = await apiService.get("/kyc/stats");
        setKpiData(response.data); // Ensure correct data extraction
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h5" color="primary">{kpiData.totalUsers}</Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Approved</Typography>
                <Typography variant="h5" color="success.main">{kpiData.approvedCount}</Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Rejected</Typography>
                <Typography variant="h5" color="error.main">{kpiData.rejectedCount}</Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Pending</Typography>
                <Typography variant="h5" color="warning.main">{kpiData.pendingCount}</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Home;
