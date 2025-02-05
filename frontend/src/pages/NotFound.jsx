import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box mt={10} textAlign="center">
        <Typography variant="h2" color="error" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
