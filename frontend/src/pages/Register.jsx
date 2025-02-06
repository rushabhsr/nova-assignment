import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiService from "../utils/apiService";
import { useUser } from "../context/useUser.js";
import { CircularProgress } from "@mui/material";

const Register = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const data = await apiService.post("/auth/register", formData);
      console.log(data);
      setSuccess(data.message);
      setTimeout(async () => {
        try {
          const response = await login({ email: formData.email, password: formData.password });
          if (response.success) {
            navigate("/");
          } else {
            setError(response.message);
          }
        } catch (err) {
          console.error(err);
          setError("An error occurred while logging in.");
        } finally {
          setIsLoading(false);
        }
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }

  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2} bgcolor="white">
        <Typography variant="h4" mb={2}>Register</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
            ) : (
              'Register'
            )}
          </Button>

        </form>
      </Box>
    </Container>
  );
};

export default Register;
