import React from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyParcels = () => {
  const { user } = useAuthContext();
  const axiosSecure = useAxiosSecure();
  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/getParcels?email=${user.email}`);
      return res.data;
    },
  });
  console.log(parcels);
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/parcels/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", "Your parcel has been deleted.", "success");
          refetch();
        }
      } catch (err) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };
  const navigate = useNavigate();
  const handlePayment = (id) => {
    navigate(`/dashBoard/payment/${id}`);
  };
  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Parcels</h2>
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            <th>#</th>
            <th>Title</th>
            <th>Parcel Type</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>
              <td>{parcel.senderName}</td>
              <td className="capitalize">{parcel.parcelType}</td>
              <td>
                <span
                  className={`badge ${
                    parcel.payment_status === "paid"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {parcel.payment_status}
                </span>
              </td>
              <td className="space-x-2">
                <button
                  onClick={() => handleDelete(parcel._id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
                <button
                  onClick={() => handlePayment(parcel._id)}
                  className="btn btn-sm "
                >
                  Pay
                </button>
                <button
                  onClick={() =>
                    Swal.fire({
                      title: "Parcel Details",
                      html: `
                        <p><b>Sender:</b> ${parcel.senderName}</p>
                        <p><b>Receiver:</b> ${parcel.receiverName}</p>
                        <p><b>Type:</b> ${parcel.parcelType}</p>
                        <p><b>Status:</b> ${parcel.delivery_status}</p>
                      `,
                      confirmButtonText: "Close",
                    })
                  }
                  className="btn btn-sm btn-info"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcels;
