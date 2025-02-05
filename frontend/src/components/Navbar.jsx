import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useUser } from "../context/useUser.js";

const Navbar = () => {
  const { user, logout } = useUser();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          KYC App
        </Typography>

        <Button color="inherit" component={Link} to="/">
          Home
        </Button>

        {user ? (
          <>
            {user.role === "admin" ? (
              <Button color="inherit" component={Link} to="/admin">
                Admin Dashboard
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/kyc">
                Submit KYC
              </Button>
            )}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
