import React from "react";
import authImage from "../../assets/authImage.png";
import Logo from "../shared/logo-name/Logo";
import { useForm } from "react-hook-form";
import useAuthContext from "../../hooks/useAuthContext";
import { Link, useLocation, useNavigate } from "react-router";
import LoginWithGoogle from "../shared/GoogleLogin/LoginWithGoogle";
const Login = () => {
  const { signInUser } = useAuthContext();
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    signInUser(data.email, data.password)
      .then((res) => navigate(from))
      .catch((error) => console.log(error));
  };
  return (
    <div className="min-h-screen">
      <div className="flex flex-row-reverse">
        <div className="flex-1  h-screen flex items-center justify-center  bg-amber-100">
          <img src={authImage} alt="" />
        </div>
        <div className="flex-1 h-screen  bg-gray-100">
          <div className="flex flex-col  h-screen items-center justify-center">
            <Logo />
            <div className="w-full max-w-sm p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset space-y-4">
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      className="input w-full"
                      placeholder="Email"
                      name="email"
                      {...register("email", { required: true })}
                    />
                    {errors.email?.type === "required" && (
                      <p className="text-red-500">email is required</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Password</label>
                    <input
                      type="password"
                      className="input w-full"
                      placeholder="Password"
                      name="password"
                      {...register("password")}
                    />
                  </div>
                  <div>
                    <a className="link link-hover text-sm">Forgot password?</a>
                  </div>
                  <button className="btn btn-neutral w-full mt-4">Login</button>
                </fieldset>
              </form>
              <a className="text-sm mt-10">
                Already have any account?{" "}
                <span className="text-black link link-hover  ">
                  <Link to={"/auth/register"}>Register</Link>
                </span>
              </a>
              <LoginWithGoogle condition={"Login"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
