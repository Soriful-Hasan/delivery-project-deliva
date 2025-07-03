const axiosInstance = {
  baseURL: `${import.meta.env.VITE_url}`,
};
const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
