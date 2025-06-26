import React from "react";
import img1 from "../../../assets/illustration/Illustration.png";
import img2 from "../../../assets/illustration/vector.png";
import img3 from "../../../assets/illustration/vector.png";

const features = [
  {
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: img1,
  },
  {
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: img2,
  },
  {
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: img3,
  },
];

const TrustedService = () => {
  return (
    <div className="space-y-8 py-10 border-t border-b border-dashed mt-10 mb-10">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="p-6 bg-white rounded-xl overflow-hidden flex flex-col lg:flex-row items-center w-full"
        >
          {/* Image Section */}
          <div className=" w-[200px] h-[200px] ">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-full "
            />
          </div>

          {/* Vertical Divider (only on large screens) */}
          <div className="border-r p-4 h-full border-dashed "></div>

          {/* Text Content */}
          <div className="w-full lg:w-2/3 px-6 py-6">
            <h3 className="text-xl font-semibold mb-2 text-primary">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustedService;
