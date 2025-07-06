import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuthContext from "../../../hooks/useAuthContext";

const PendingRider = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthContext();
  const [selectedRider, setSelectedRider] = useState(null);
  const { data: riders = [], refetch } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  const handleAction = async (id, action, email) => {
    const confirm = await Swal.fire({
      title: `Are you sure to ${action} this rider?`,
      icon: action === "approve" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/riders/${action}/${id}`, {
          email,
        });
        if (res.data.modifiedCount > 0) {
          Swal.fire(`Rider ${action}d!`, "", "success");
          refetch();
        }
      } catch (err) {
        console.error(`${action} failed`, err);
        Swal.fire("Error", `Could not ${action} rider`, "error");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Riders</h2>
      <div className="overflow-x-auto">
        <table className="table w-full ">
          <thead>
            <tr className="bg-base-200 text-left">
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider) => (
              <tr key={rider._id}>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.region}</td>
                <td>{rider.status}</td>
                <td className="space-x-2">
                  <button
                    onClick={() =>
                      handleAction(rider._id, "approve", rider.email)
                    }
                    className="btn btn-xs btn-success"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() =>
                      handleAction(rider._id, "reject", user?.email)
                    }
                    className="btn btn-xs btn-error"
                  >
                    <FaTimes />
                  </button>
                  <button
                    onClick={() => setSelectedRider(rider)}
                    className="btn btn-xs btn-info"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rider Details Modal */}
      {selectedRider && (
        <dialog id="rider_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Rider Details</h3>
            <p>
              <strong>Name:</strong> {selectedRider.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedRider.email}
            </p>
            <p>
              <strong>Region:</strong> {selectedRider.region}
            </p>
            <p>
              <strong>Status:</strong> {selectedRider.status}
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedRider(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRider;
