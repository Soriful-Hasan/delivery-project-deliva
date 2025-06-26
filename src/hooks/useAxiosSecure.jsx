import axios from "axios";
import React from "react";

const useAxiosSecure = () => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_url}`,
  });
  return instance;
};

export default useAxiosSecure;
