import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useTrackingLog from "../../../hooks/useTrakingLog";

const PendingDeliveries = () => {
  const { user } = useAuthContext();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { mutate: addTrackingLog } = useTrackingLog();
  const { data: pendingTask = [], isLoading } = useQuery({
    queryKey: ["riderTasks", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/rider-pending-tasks?email=${user.email}`
      );
      return res.data;
    },
  });
  // Mutation for updating delivery status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ parcel, newStatus }) => {
      console.log(newStatus);
      const res = await axiosSecure.patch(
        `/api/update-delivery-status/${parcel._id}`,
        {
          newStatus,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingDeliveries"]);
    },
    onError: () => {
      Swal.fire("Error!", "Failed to update status.", "error");
    },
  });

  const handleUpdateStatus = (parcel, status) => {
    let selectStatus = "";
    if (status === "in_transit") {
      selectStatus = "in_transit";
    } else if (status === "Delivered") {
      selectStatus = "Delivered";
    }
    let trackDetails = "";
    if (status === "in_transit") {
      trackDetails = `Picked up by ${user?.displayName}`;
    } else if (status === "Delivered") {
      trackDetails = `Delivered by ${user?.displayName}`;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Mark this delivery as delivered?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation
          .mutateAsync({
            parcel,
            newStatus: selectStatus,
          })
          .then(() => {
            // success toast
            addTrackingLog({
              tracking_Id: parcel.tracking_Id,
              status: selectStatus,
              details: trackDetails,
              updatedBy: user?.email || "system",
            });
            Swal.fire("Success!", "Delivery status updated.", "success");
          })
          .catch((error) => {
            // error toast
            Swal.fire("Error!", "Delivery status updated.", "error");
          });
      }
    });
  };

  if (isLoading) {
    return <p>Loading....</p>;
  }
  return (
    <div className="overflow-x-auto mt-6">
      <table className="table table-zebra w-full ">
        <thead>
          <tr className="bg-gray-100">
            <th>#</th>
            <th>Tracking ID</th>
            <th>Receiver</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingTask.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>
              <td>{parcel.tracking_Id}</td>
              <td>{parcel.receiverName}</td>
              <td>{parcel.receiverAddress}</td>
              <td>{parcel.delivery_status}</td>
              <td>
                <button
                  onClick={() => handleUpdateStatus(parcel, "Delivered")}
                  className="btn btn-sm btn-success"
                >
                  Mark Delivered
                </button>
                <button
                  onClick={() => handleUpdateStatus(parcel, "in_transit")}
                  className="btn btn-sm btn-success"
                >
                  In transit
                </button>
              </td>
            </tr>
          ))}
          {pendingTask.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-gray-400 py-4">
                No pending deliveries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingDeliveries;
