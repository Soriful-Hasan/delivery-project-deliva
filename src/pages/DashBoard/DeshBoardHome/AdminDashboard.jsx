import { useQuery } from "@tanstack/react-query";

import { FaBoxOpen, FaTruckMoving, FaUserCheck, FaClock } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import DeliveryStatusPieChart from "./Chart/DeliveryStatusPieChart";

const DeliveryStatusSummary = () => {
  const axiosSecure = useAxiosSecure();

  const { data: statusData = [], isLoading } = useQuery({
    queryKey: ["deliveryStatusSummary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data; // Expected format: [{ count, status }]
    },
  });

  // Map status to styles and icons
  const statusConfig = {
    not_collection: {
      label: "Not Collected",
      icon: <FaClock size={28} className="text-red-500" />,
      bg: "bg-red-100",
      text: "text-red-700",
    },
    Delivered: {
      label: "Delivered",
      icon: <FaBoxOpen size={28} className="text-green-600" />,
      bg: "bg-green-100",
      text: "text-green-700",
    },
    rider_assigned: {
      label: "Rider Assigned",
      icon: <FaUserCheck size={28} className="text-yellow-600" />,
      bg: "bg-yellow-50",
      text: "text-yellow-800",
    },
    in_transit: {
      label: "In Transit",
      icon: <FaTruckMoving size={28} className="text-blue-500" />,
      bg: "bg-blue-100",
      text: "text-blue-700",
    },
  };

  if (isLoading) {
    return <span className="loading loading-spinner text-primary"></span>;
  }

  return (
    <div className="">
      <div className="m-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {statusData.map((item, idx) => {
          const config = statusConfig[item.status] || {
            label: item.status,
            icon: <FaBoxOpen size={28} />,
            bg: "bg-gray-100",
            text: "text-gray-700",
          };

          return (
            <div
              key={idx}
              className={`card ${config.bg} ${config.text} shadow-md p-4 rounded-xl flex items-center gap-4`}
            >
              <div>{config.icon}</div>
              <div>
                <h2 className="text-lg font-semibold">{config.label}</h2>
                <p className="text-3xl text-center font-bold">{item.count}</p>
              </div>
            </div>
          );
        })}
      </div>
      <DeliveryStatusPieChart />
    </div>
  );
};

export default DeliveryStatusSummary;
