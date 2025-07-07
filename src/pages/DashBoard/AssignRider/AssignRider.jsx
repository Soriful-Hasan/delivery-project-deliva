import React, { useEffect, useState } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useTrackingLog from "../../../hooks/useTrakingLog";
import useAuthContext from "../../../hooks/useAuthContext";

const AssignRider = () => {
  const queryClient = useQueryClient();
  const { mutate: addTrackingLog } = useTrackingLog();
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [assignRiderName, setAssignRiderName] = useState(null);
  const [handleModal, setHandleModal] = useState(false);
  const { user } = useAuthContext();
  console.log("select parcel data", selectedParcel);
  // Fetch parcels
  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["paidParcels", "notCollection"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/getParcels?payment_status=paid&delivery_status=not_collection"
      );
      return res.data;
    },
  });

  // Fetch riders for selected serviceCenter
  const {
    data: riders = [],
    isLoading: ridersLoading,
    refetch: refetchRiders,
  } = useQuery({
    queryKey: ["riders", selectedParcel?.receiverRegion],
    queryFn: async () => {
      if (!selectedParcel?.receiverRegion) return [];
      const res = await axiosSecure.get(
        `/riders?region=${selectedParcel.receiverRegion}` // ✅ send region from serviceCenter
      );
      return res.data;
    },
    enabled: !!selectedParcel?.receiverRegion,
  });

  console.log("riders data when match rider region", riders);

  const handleAssignClick = (parcel) => {
    console.log(parcel);
    setSelectedParcel(parcel);
    setHandleModal(true);
  };
  const assignRiderMutation = useMutation({
    mutationFn: async ({ parcelId, riderId, riderName, riderEmail }) => {
      setAssignRiderName(riderName);
      const res = await axiosSecure.patch(`/assign-rider/${parcelId}`, {
        riderId,
        riderName,
        riderEmail,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success!", "Rider assigned successfully", "success");
      addTrackingLog({
        tracking_Id: selectedParcel.tracking_Id, // string
        status: `Assigned to ${assignRiderName}`,
        details: `created by ${user?.displayName}`, // example status
        updatedBy: user?.email || "system", // from AuthContext
      });
      setHandleModal(false);
      setSelectedParcel(null);
      queryClient.invalidateQueries(["paidParcels", "notCollection"]); // refetch the parcel list
    },
    onError: (error) => {
      console.error(error);
      Swal.fire("Error!", "Failed to assign rider", "error");
    },
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error loading data</p>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-bold mb-4">Paid & Not Collected Parcels</h2>
      <table className="table table-zebra w-full">
        <thead className="bg-gray-100">
          <tr>
            <th>#</th>
            <th>Tracking ID</th>
            <th>Parcel Type</th>
            <th>Sender Name</th>
            <th>Receiver Name</th>
            <th>Amount</th>
            <th>District</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>
              <td>{parcel.tracking_Id}</td>
              <td>{parcel.parcelType}</td>
              <td>{parcel.senderName}</td>
              <td>{parcel.receiverName}</td>
              <td>{parcel.amount}৳</td>
              <td>{parcel.receiverRegion}</td>
              <td>{new Date(parcel.creation_date).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleAssignClick(parcel)}
                  className="btn btn-sm btn-primary"
                >
                  Assign Rider
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal */}
      {handleModal && selectedParcel && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl w-full">
            <h3 className="font-bold text-lg mb-2">
              Assign Rider for: {selectedParcel.tracking_Id}
            </h3>
            <p className="mb-4">
              <strong>Service Center:</strong> {selectedParcel.serviceCenter}
            </p>

            {ridersLoading ? (
              <p className="text-center">Loading riders...</p>
            ) : riders.length === 0 ? (
              <p className="text-center text-red-500">
                No riders found for this region.
              </p>
            ) : (
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Rider Name</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((rider, idx) => (
                    <tr key={rider._id}>
                      <td>{idx + 1}</td>
                      <td>{rider.name}</td>
                      <td>{rider.phone}</td>
                      <td>
                        <button
                          onClick={() =>
                            assignRiderMutation.mutate({
                              parcelId: selectedParcel._id,
                              riderId: rider._id,
                              riderName: rider.name,
                              riderEmail: rider.email,
                            })
                          }
                          className="btn btn-sm btn-success"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="modal-action">
              <button
                onClick={() => {
                  setHandleModal(false);
                  setSelectedParcel(null);
                }}
                className="btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
