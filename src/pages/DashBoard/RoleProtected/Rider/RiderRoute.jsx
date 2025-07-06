import React from "react";
import useAuthContext from "../../../../hooks/useAuthContext";
import useUserRole from "../../../../hooks/useUserRole";
import { Navigate, useNavigate } from "react-router";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    <p>Loading......</p>;
  }
  if (!user || role !== "rider") {
    <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>;
  }
  return children;
};

export default RiderRoute;
