import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuthContext from "../../../hooks/useAuthContext";
import Swal from "sweetalert2";

const CompletedDeliveries = () => {
  const { user } = useAuthContext();
  const axiosSecure = useAxiosSecure();
  const [cashOut, setCashOut] = useState(false);
  const queryClient = useQueryClient();

  const riderEmail = user?.email;
  console.log("rider email", riderEmail);
  // ✅ Load completed parcels assigned to this rider
  const { data: completedParcels = [], isLoading } = useQuery({
    queryKey: ["completedParcels", riderEmail],
    enabled: !!riderEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/rider-completed-parcels?email=${riderEmail}`
      );
      return res.data;
    },
  });

  // ✅ Mutation to update cashout status
  const cashOutMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await axiosSecure.patch(`/api/rider-cashout/${id}`, {});
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success!", "Cash out done for this parcel.", "success");
      queryClient.invalidateQueries(["completedParcels", riderEmail]);
    },
    onError: () => {
      Swal.fire("Error!", "Failed to update cash out.", "error");
    },
  });

  const calculateEarning = (parcel) => {
    const amount = Number(parcel.amount) || 0;
    const isSameDistrict =
      parcel.senderRegion?.trim().toLowerCase() ===
      parcel.receiverRegion?.trim().toLowerCase();
    const earned = isSameDistrict ? amount * 0.8 : amount * 0.3;
    return earned.toFixed(2);
  };
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">Rider Completed Parcels</h2>

      <div className="overflow-x-auto border rounded-lg">
        <table className="table table-zebra w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Sender District</th>
              <th>Receiver District</th>
              <th>Parcel Amount (৳)</th>
              <th>Your Earning (৳)</th>
              <th>Cash Out</th>
            </tr>
          </thead>
          <tbody>
            {completedParcels.map((parcel, index) => {
              const earning = calculateEarning(parcel);
              return (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.tracking_Id}</td>
                  <td>{parcel.senderRegion}</td>
                  <td>{parcel.receiverRegion}</td>
                  <td>{parcel.amount}</td>
                  <td className="text-green-600">{earning}</td>
                  <td>
                    {parcel.cashout_status === "cashed_out" ? (
                      <span className="text-gray-500 text-sm">
                        Already Cashed Out
                      </span>
                    ) : (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          Swal.fire({
                            title: "Cash Out?",
                            text: `Confirm cash out for ৳${earning}?`,
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Yes, Cash Out",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              cashOutMutation.mutate({
                                id: parcel._id,
                                amount: earning, // pass earning if needed in backend
                              });
                            }
                          });
                        }}
                      >
                        Cash Out
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {completedParcels.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No completed parcels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedDeliveries;
