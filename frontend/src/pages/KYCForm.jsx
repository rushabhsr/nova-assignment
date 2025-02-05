import { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert } from "@mui/material";
import apiService from "../utils/apiService";

const KYCForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", document: null });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [kycStatus, setKycStatus] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchKYCDetails = async () => {
      try {
        const response = await apiService.get("/kyc");
        if (response.kyc) {
          setKycStatus(response.kyc.status);
          setFormData({
            name: response.kyc.name,
            email: response.kyc.email,
            document: null, // Not pre-filling document for security reasons
          });
        }
      } catch (error) {
        console.error("Failed to fetch KYC details:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchKYCDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, document: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("document", formData.document);

      await apiService.post("/kyc", formDataToSend, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage({ type: "success", message: "KYC submitted successfully!" });
      setKycStatus("pending"); // Update status after re-submission
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", message: "Submission failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Container maxWidth="sm">
        <Box mt={5} p={3} boxShadow={3} borderRadius={2} bgcolor="white" textAlign="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h4" mb={3}>KYC Submission</Typography>

        {message && <Alert severity={message.type}>{message.message}</Alert>}
        <Alert severity={kycStatus === "approved" ? "success" : kycStatus === "rejected" ? "error" : "info"}>
          Your KYC status: <strong>{kycStatus.toUpperCase()}</strong>
        </Alert>

        {kycStatus && kycStatus !== "rejected" ? <></>
          : (
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
              <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
              <input type="file" onChange={handleFileChange} accept="image/*,.pdf" required />
              <Box mt={3}>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </Box>
            </form>
          )}
      </Box>
    </Container>
  );
};

export default KYCForm;
