import { Navigate } from "react-router-dom";
import { useUser } from "../context/useUser.js";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, allowedRoles=[] }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.array.isRequired,
};

export default ProtectedRoute;
