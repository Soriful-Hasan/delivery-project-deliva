import React from "react";
import locationImg from "../../../assets/location-merchant.png";
import bgImg from "../../../assets/be-a-merchant-bg.png";
const MarchantCard = () => {
  return (
    <div>
      <div
        className=" bg-[#03373D] p-20 rounded-lg mb-10  bg-no-repeat"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="hero-content flex-col lg:flex-row-reverse justify-around">
          <img src={locationImg} className="max-w-sm rounded-lg " />
          <div>
            <h1 className="text-2xl font-bold text-white ">
              Merchant and Customer Satisfaction <br /> is Our First Priority
            </h1>
            <p className="py-6 text-sm text-gray-300">
              We offer the lowest delivery charge with the highest value along
              with <br /> 100% safety of your product. Pathao courier delivers
              your parcels in every <br /> corner of Bangladesh right on time.
            </p>
            <button className="btn mt-5 btn-primary  text-black  rounded-full">
              Become a Merchant
            </button>
            <button className="btn ml-4 mt-5 btn-outline rounded-full text-primary">
              Earn with Profast Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarchantCard;
