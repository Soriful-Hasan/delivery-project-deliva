import React from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import useUserRole from "../../../hooks/useUserRole";
import { Navigate } from "react-router";
import { AuthContext } from "../../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { loading, user } = useAuthContext();
  const { roleLoading, role } = useUserRole();
  // console.log("role Loading", roleLoading, "role", role, "loading", loading);
  // console.log(role);
  if (loading || roleLoading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user || role !== "admin") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );
  }
  return children;
};

export default AdminRoute;
