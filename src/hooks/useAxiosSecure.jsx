import axios from "axios";
import React, { useEffect } from "react";
import useAuthContext from "./useAuthContext";
import { useNavigate } from "react-router";
import { NonBinary } from "lucide-react";
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_url}`,
});
const useAxiosSecure = () => {
  const { user, signOutUser } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    instance.interceptors.request.use(
      (config) => {
        if (config) {
          config.headers.Authorization = `Bearer ${user?.accessToken}`;
        }
        return config;
      },

      (error) => {
        return Promise.reject(error);
      }
    );
    instance.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        // console.log("inside response interceptor", error.response.status);

        if (error.response.status === 403) {
          navigate("/forbidden");
        } else if (error.response.status === 401) {
          signOutUser();
          navigate("/auth/login");
        }
        return Promise.reject(error);
      }
    );
  }, [user?.accessToken]);

  // axios.get("https://jsonplaceholder.typicode.com/invalid-url").catch((err) => {
  //   console.log("❌ Final catch block", err.message);
  // });
  return instance;
};

export default useAxiosSecure;
