import React from "react";
import Marquee from "react-fast-marquee";
import logo1 from "../../../assets/brands/amazon.png";
import logo2 from "../../../assets/brands/amazon_vector.png";
import logo3 from "../../../assets/brands/moonstar.png";
import logo4 from "../../../assets/brands/randstad.png";
import logo5 from "../../../assets/brands/start-people 1.png";
import logo6 from "../../../assets/brands/start.png";

const companyLogos = [logo1, logo2, logo3, logo4, logo5, logo6];

const SalesTeamsMarque = () => {
  return (
    <div className="bg-white py-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        We've helped thousands of sales teams
      </h2>
      <Marquee
        pauseOnHover
        direction="right"
        speed={40}
        gradient={false}
        className="py-2"
      >
        {companyLogos.map((logo, idx) => (
          <img
            key={idx}
            src={logo}
            alt={`Logo ${idx}`}
            className="w-25 h-16 object-contain mx-20 opacity-80 hover:opacity-100 transition"
          />
        ))}
      </Marquee>
    </div>
  );
};

export default SalesTeamsMarque;
