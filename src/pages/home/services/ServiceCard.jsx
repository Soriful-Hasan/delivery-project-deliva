import React from "react";

const ServiceCard = ({ service }) => {
  const { icon: icon, title, description } = service;
  return (
    <div className="">
      <div className="card bg-white shadow-md p-6 hover:shadow-xl transition duration-300 h-full flex flex-col justify-between ">
        <div>
          <div className="mb-4">{icon}</div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
