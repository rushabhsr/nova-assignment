import { useEffect, useState } from "react";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert, Link } from "@mui/material";
import apiService from "../../utils/apiService";

const Dashboard = () => {
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchKycRequests = async () => {
      try {
        const data = await apiService.get("/kyc"); // Adjusted based on API response
        setKycRequests(data.kycs);
      } catch (error) {
        console.error(error);
        setStatusMessage({ type: "error", message: "Failed to fetch KYC requests" });
      } finally {
        setLoading(false);
      }
    };

    fetchKycRequests();
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

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Submitted By</strong></TableCell>
                  <TableCell><strong>Document</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kycRequests.map((kyc,index) => (
                  <TableRow key={index}>
                    <TableCell>{kyc.name}</TableCell>
                    <TableCell>{kyc.email}</TableCell>
                    <TableCell>{kyc.user.name} ({kyc.user.email})</TableCell>
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
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
