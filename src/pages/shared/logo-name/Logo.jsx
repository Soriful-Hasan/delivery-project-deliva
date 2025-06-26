import React from "react";
import logo from "../../.././assets/logo.png";
import { useNavigate } from "react-router";

const Logo = () => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/");
  };
  return (
    <div className="flex items-end cursor-pointer" onClick={handleHome} >
      <img src={logo} alt="" className="mb-2" />
      <p className="text-3xl font-bold -ml-3">Deliva</p>
    </div>
  );
};

export default Logo;
