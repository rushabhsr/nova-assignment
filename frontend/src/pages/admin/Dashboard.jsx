import { useEffect, useState } from "react";
import {
  Container, Typography, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert, Link, Tabs, Tab
} from "@mui/material";
import apiService from "../../utils/apiService";
import { formatDateToIST } from "../../utils/commonUtils";
const Dashboard = () => {
  const [kycRequests, setKycRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.get("/kyc/all");
        setKycRequests(data.kycs);
        setUsers(data.users);
      } catch (error) {
        console.error(error);
        setStatusMessage({ type: "error", message: "Failed to fetch data" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (kycId, newStatus) => {
    try {
      await apiService.put(`/kyc/${kycId}`, { status: newStatus });

      setKycRequests((prevKycRequests) =>
        prevKycRequests.map((kyc) =>
          kyc._id === kycId ? { ...kyc, status: newStatus } : kyc
        )
      );

      setStatusMessage({ type: "success", message: `KYC ${newStatus} successfully!` });
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: "error", message: "Failed to update status" });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h4" mb={3}>Admin Dashboard</Typography>

        {statusMessage && <Alert severity={statusMessage.type}>{statusMessage.message}</Alert>}

        <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} sx={{ mb: 2 }}>
          <Tab label="Verify KYC" />
          <Tab label="All Users" />
        </Tabs>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {tabIndex === 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Submitted On</strong></TableCell>
                      <TableCell><strong>Document</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {kycRequests.map((kyc, index) => (
                      <TableRow key={index}>
                        <TableCell>{kyc.name}</TableCell>
                        <TableCell>{kyc.email}</TableCell>
                        <TableCell>{formatDateToIST(kyc.updatedAt)}</TableCell>
                        <TableCell>
                          <Link href={`/${kyc.document}`} target="_blank" rel="noopener noreferrer">
                            View Document
                          </Link>
                        </TableCell>
                        <TableCell>{kyc.status}</TableCell>
                        <TableCell>
                          {kyc.status === "pending" && (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleStatusChange(kyc._id, "approved")}
                                sx={{ mr: 1 }}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleStatusChange(kyc._id, "rejected")}
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
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Registered on</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatDateToIST(user.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
