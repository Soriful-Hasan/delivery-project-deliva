import React from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import { useLocation, useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const LoginWithGoogle = ({ condition }) => {
  const axiosInstance = useAxiosSecure();
  const { signInWithGoogle } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.pathname || "/";
  console.log(from);
  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then(async (res) => {
        console.log(res.user);
        console.log(from);
        navigate(from);
        const userData = {
          email: res.user.email,
          role: "user",
          created_Data: new Date().toISOString(),
          last_Register: new Date().toISOString(),
        };

        const userDataRes = await axiosInstance.post("user", userData);
        console.log(userDataRes.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="flex flex-col text-center mt-4 space-y-4">
      <span>Or</span>
      <button
        onClick={handleGoogleLogin}
        className="btn bg-white text-black border-[#e5e5e5]"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        {condition} with Google
      </button>
    </div>
  );
};

export default LoginWithGoogle;
