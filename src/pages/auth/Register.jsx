import React, { useContext } from "react";
import authImage from "../../assets/authImage.png";
import Logo from "../shared/logo-name/Logo";
import { useForm } from "react-hook-form";
import useAuthContext from "../../hooks/useAuthContext";
import { AuthContext } from "../../context/AuthContext";
import LoginWithGoogle from "../shared/GoogleLogin/LoginWithGoogle";
import { Link } from "react-router";
const Register = () => {
  // const { signUpUser } = useAuthContext();
  const { signUpUser } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data, e) => {
    e.preventDefault();
    console.log(data.email);
    signUpUser(data.email, data.password)
      .then((res) => {
        console.log(res.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="min-h-screen ">
      <div className="flex flex-row-reverse">
        <div className="flex-1  h-screen flex items-center justify-center  bg-amber-100">
          <img src={authImage} alt="" />
        </div>
        <div className="flex-1 h-screen  bg-gray-100">
          <div className="flex flex-col  h-screen items-center justify-center">
            <Logo />
            <div className="text-3xl font-bold mt-5">Register Now</div>
            <div className="w-full max-w-sm p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset space-y-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="Full Name"
                      name="name"
                      {...register("email", { required: true })}
                    />
                    {errors.email?.type === "required" && (
                      <p className="text-red-500">email is required</p>
                    )}
                  </div>
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
                      {...register("password", { required: true })}
                    />
                    {errors.password?.type === "required" && (
                      <p className="text-red-500">password is required</p>
                    )}
                  </div>
                  <div className="">
                    <a className="link link-hover text-sm">Forgot password?</a>
                  </div>

                  <button type="submit" className="btn btn-neutral w-full ">
                    Register
                  </button>
                </fieldset>
              </form>
              <a className="text-sm mt-10">
                Don't have any account?{" "}
                <span className="text-black link link-hover  ">
                  <Link to={'/auth/login'}>Register</Link>
                </span>
              </a>
              <LoginWithGoogle condition={'Register'}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
