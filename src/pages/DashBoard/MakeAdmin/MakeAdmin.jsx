import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

const fetchUsersByEmail = async (email) => {
  const res = await axios.post("http://localhost:5000/admin/manage", {
    action: "search",
    email,
  });
  return res.data;
};

const MakeAdmin = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: users = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["users", searchEmail],
    queryFn: () => fetchUsersByEmail(searchEmail),
    enabled: triggerSearch && searchEmail.length > 0, // only fetch on demand
  });

  const handleSearch = () => {
    setTriggerSearch(true);
    refetch();
  };

  const roleMutation = useMutation({
    mutationFn: ({ email, action }) =>
      axios.post("http://localhost:5000/admin/manage", {
        action,
        email,
      }),
    onSuccess: (res) => {
      Swal.fire("Success", res.data.message, "success");
      queryClient.invalidateQueries(["users", searchEmail]); // ✅ Refetch
    },
    onError: () => {
      Swal.fire("Error", "Role update failed", "error");
    },
  });

  const handleRoleChange = (email, action) => {
    roleMutation.mutate({ email, action });
  };

  return (
    <div className="p-4  w-8/12 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Manager</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="email"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isFetching ? "Searching..." : "Search"}
        </button>
      </div>

      {users.length > 0 && (
        <div className="border rounded">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2 flex gap-2">
                    {user.role !== "admin" ? (
                      <button
                        onClick={() =>
                          handleRoleChange(user.email, "make-admin")
                        }
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleRoleChange(user.email, "remove-admin")
                        }
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Remove Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
