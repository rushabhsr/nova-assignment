import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert } from "@mui/material";
import apiService from "../../utils/apiService";
import { useUser } from "../../context/UserContext.jsx";

const Dashboard = () => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiService.get("/admin/users");
        setUsers(data.users);
      } catch (error) {
        setStatusMessage({ type: "error", message: "Failed to fetch users" });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, status) => {
    try {
      await apiService.put(`/admin/kyc/${userId}`, { status });
      setUsers(users.map(user => user._id === userId ? { ...user, kycStatus: status } : user));
      setStatusMessage({ type: "success", message: `KYC ${status} successfully!` });
    } catch (error) {
      setStatusMessage({ type: "error", message: "Failed to update status" });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h4" mb={3}>Admin Dashboard</Typography>

        {statusMessage && <Alert severity={statusMessage.type}>{statusMessage.message}</Alert>}

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>KYC Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.kycStatus}</TableCell>
                    <TableCell>
                      {user.kycStatus === "pending" && (
                        <>
                          <Button 
                            variant="contained" 
                            color="success" 
                            onClick={() => handleStatusChange(user._id, "approved")}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="contained" 
                            color="error" 
                            onClick={() => handleStatusChange(user._id, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
