import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";

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
            {user.role === "admin" && (
              <Button color="inherit" component={Link} to="/admin/dashboard">
                Admin Dashboard
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
