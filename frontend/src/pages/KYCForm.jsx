import  { useState } from "react";
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert } from "@mui/material";
import apiService from "../utils/apiService";
import { useUser } from "../context/useUser.js";

const KYCForm = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({ name: "", email: "", document: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
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

      await apiService.post("/kyc/submit", formDataToSend);
      setMessage({ type: "success", message: "KYC submitted successfully!" });
    } catch (error) {
      setMessage({ type: "error", message: "Submission failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h4" mb={3}>KYC Submission</Typography>

        {message && <Alert severity={message.type}>{message.message}</Alert>}

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
      </Box>
    </Container>
  );
};

export default KYCForm;
