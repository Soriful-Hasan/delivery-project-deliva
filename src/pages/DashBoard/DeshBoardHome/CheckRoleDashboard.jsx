import React from "react";
import useUserRole from "../../../hooks/useUserRole";
import UserDashboard from "./UserDashboard";
import RiderDashboard from "./RiderDashboard";
import AdminDashboard from "./AdminDashboard";
import Forbidden from "../../Forbidden/Forbidden";

const CheckRoleDashboard = () => {
  const { role, roleLoading } = useUserRole();
  if (roleLoading) {
    return <h1>Loading Role......</h1>;
  }
  if (role === "user") {
    return <UserDashboard />;
  } else if (role === "rider") {
    return <RiderDashboard />;
  } else if (role === "admin") {
    return <AdminDashboard />;
  } else {
    return <Forbidden />;
  }
};

export default CheckRoleDashboard;
