import React, { useContext } from "react";
import { Link } from "react-router";
import Logo from "../logo-name/Logo";
import useAuthContext from "../../../hooks/useAuthContext";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuthContext();
  const { signOutUser } = useContext(AuthContext);
  console.log(user);
  const handleLogout = (e) => {
    e.preventDefault();
    signOutUser()
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  };
  const navItems = (
    <>
      <li>
        <Link to={"/"}>Home</Link>
      </li>
      <li>
        <Link to={"/trackOrder"}>Track Order</Link>
      </li>
      <li>
        <Link to={"/pricing"}>Pricing</Link>
      </li>
      <li>
        <Link to={"/beARider"}>Be a Rider</Link>
      </li>
      {user && (
        <li>
          <Link to={"/dashBoard"}>Dash Board</Link>
        </li>
      )}
      <li>
        <Link to={"/about"}>About</Link>
      </li>
    </>
  );
  return (
    <div className="p-4">
      <div className="navbar bg-white  rounded-xl p-4 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navItems}
            </ul>
          </div>
          <a className="">
            <Logo />
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>
        <div className="navbar-end">
          {user ? (
            <div className="space-x-6">
              <Link className="btn btn-primary" onClick={handleLogout}>
                Log out
              </Link>
              <button className="">{user.displayName}</button>
            </div>
          ) : (
            <Link to={"auth/login"} className="btn">
              Log in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
