import React from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../components/Loader/Loader";

const PaymentHistory = () => {
  const { user } = useAuthContext();
  const axiosSecure = useAxiosSecure();
  const { data: paymentData = [], isLoading } = useQuery({
    queryKey: ["parcelHistory", user?.email],
    queryFn: async () => {
      const historyData = await axiosSecure.get(
        `/history?email=${user?.email}`
      );
      return historyData.data;
    },
  });
  console.log(paymentData);
  if (isLoading) return <Loader />;
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <div className="overflow-x-auto">
        <table className="table w-full ">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paymentData?.map((payment, index) => (
              <tr key={payment._id} className="hover">
                <td>{index + 1}</td>
                <td>{payment.tracking_Id}</td>
                
                <td>৳{payment.amount}</td>
                <td>{payment.payment_method?.[0]}</td>
                <td className="text-xs break-all">{payment.transaction_id}</td>
                <td>
                  <span className="badge badge-success text-white">
                    {payment.status}
                  </span>
                </td>
                <td>{new Date(payment.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
