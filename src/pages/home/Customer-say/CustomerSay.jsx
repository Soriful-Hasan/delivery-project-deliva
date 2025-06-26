import React from "react";
import CustomerSlider from "./CustomerSlider";
import customer from "../../../assets/customer-top.png";

const CustomerSay = () => {
  return (
    <div className="text-center ">
      <div className="place-items-center">
        <img src={customer} alt="" />
        <h1 className="text-4xl font-bold">Wat our customers are sayings</h1>
        <p className="text-sm mt-4 mb-10 text-gray-600">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce <br /> pain, and strengthen your
          body with ease!
        </p>
      </div>
      <CustomerSlider />
    </div>
  );
};

export default CustomerSay;
