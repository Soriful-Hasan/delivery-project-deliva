import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuthContext from "./useAuthContext";

const useUserRole = () => {
  const { user, loading } = useAuthContext();
  const axiosInstance = useAxiosSecure();
  const {
    data: role = null,
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email && !loading, // only fetch when email is available
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/role/${user?.email}`);
      return res.data.role;
    },
  });

  return { role, roleLoading, refetch };
};

export default useUserRole;
