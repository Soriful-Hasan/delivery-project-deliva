import React from "react";
import Collaps from "./Collaps";

const AskedQuestion = () => {
  return (
    <div className="mt-10">
      <div className=" text-center space-y-4 ">
        <h1 className="text-3xl font-bold">Frequently Asked Question (FAQ)</h1>
        <p className="text-sm text-gray-600">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce <br /> pain, and strengthen your
          body with ease!
        </p>
      </div>
      <Collaps />
    </div>
  );
};

export default AskedQuestion;
