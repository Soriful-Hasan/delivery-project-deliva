// src/hooks/useAddParcel.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useTrackingLog = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (trackingData) => {
      const res = await axiosSecure.post("/tracking", trackingData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userParcels"]); // Refetch user's parcel list if needed
    },
  });

  return mutation;
};

export default useTrackingLog;
