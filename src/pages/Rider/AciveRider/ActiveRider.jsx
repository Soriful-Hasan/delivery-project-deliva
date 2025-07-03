import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // Fetch approved riders
  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=active");
      return res.data;
    },
  });

  // Mutation for deactivating a rider
  const deactivateMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/riders/${id}`, {
        status: "inactive",
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success!", "Rider has been deactivated.", "success");
      queryClient.invalidateQueries(["activeRiders"]);
    },
    onError: () => {
      Swal.fire("Error!", "Something went wrong.", "error");
    },
  });

  // Search filter
  const filteredRiders = riders.filter((rider) =>
    rider.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Active Riders</h1>

      <input
        type="text"
        placeholder="Search by name..."
        className="input input-bordered w-full max-w-sm mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.region}</td>
                <td className="capitalize">{rider.status}</td>
                <td>
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You want to deactivate this rider?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, deactivate!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deactivateMutation.mutate(rider._id);
                        }
                      });
                    }}
                    className="btn btn-sm btn-error"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRiders.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No riders found.</p>
        )}
      </div>
    </div>
  );
};

export default ActiveRider;
