import React, { Children } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import Register from "../../pages/auth/Register";
import { Navigate, useLocation } from "react-router";
import Loader from "../Loader/Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <Loader></Loader>;
  }
  if (!user) {
    return (
      <Navigate
        state={{ from: location.pathname }}
        to={"/auth/login"}
      ></Navigate>
    );
  }
  return children;
};

export default PrivateRoute;
