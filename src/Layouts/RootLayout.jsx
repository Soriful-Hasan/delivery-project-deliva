import React from "react";
import { Outlet } from "react-router";
import Navbar from "../pages/shared/navbar/Navbar";
import Footer from "../pages/shared/footer/Footer";

const RootLayout = () => {
  return (
    <div className="w-11/12 mx-auto ">
      <Navbar></Navbar>
      <div className="h-screen w-11/12 mx-auto">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
