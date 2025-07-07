import { useQuery } from "@tanstack/react-query";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

ChartJS.register(ArcElement, Tooltip, Legend);

const DeliveryStatusPieChart = () => {
  const axiosSecure = useAxiosSecure();

  const { data: statusData = [], isLoading } = useQuery({
    queryKey: ["deliveryStatusSummary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center">Loading chart...</p>;
  }

  const labels = statusData.map((item) => item.status);
  const dataCounts = statusData.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Delivery Status",
        data: dataCounts,
        backgroundColor: [
          "#EF4444", // red
          "#10B981", // green
          "#F59E0B", // yellow
          "#3B82F6", // blue
          "#6B7280", // gray (for unknown)
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-4 mt-6">
      <h2 className="text-lg font-bold text-center mb-4">
        Delivery Status Chart
      </h2>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default DeliveryStatusPieChart;
