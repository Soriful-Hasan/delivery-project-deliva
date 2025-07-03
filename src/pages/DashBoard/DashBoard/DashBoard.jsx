import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { Link, Outlet } from "react-router";
import Logo from "../../shared/logo-name/Logo";
import {
  FaHome,
  FaBoxOpen,
  FaHistory,
  FaUserEdit,
  FaUserClock,
} from "react-icons/fa";
import useUserRole from "../../../hooks/useUserRole";
const DashBoard = () => {
  const { role, rolLoading } = useUserRole();
  console.log(role);
  const link = [
    <div className="mt-6 flex flex-col gap-5">
      <li>
        <Link to={"/dashboard/myParcel"}>
          <FaBoxOpen style={{ marginRight: 8 }} />
          My Parcel
        </Link>
      </li>
      <li>
        <Link to={"/dashboard/trackParcel"}>
          <FaBoxOpen style={{ marginRight: 8 }} />
          Track Parcel
        </Link>
      </li>
      <li>
        <Link to={"/dashboard/paymentHistory"}>
          <FaHistory style={{ marginRight: 8 }} />
          Payment History
        </Link>
      </li>
      <li>
        <Link to={"/dashboard/updateProfile"}>
          <FaUserEdit style={{ marginRight: 8 }} />
          Update Profile
        </Link>
      </li>

      {!rolLoading && role === "admin" && (
        <>
          <li>
            <Link to={"/dashboard/makeAdmin"}>
              <FaBoxOpen style={{ marginRight: 8 }} />
              Make Admin
            </Link>
          </li>
          <li>
            <Link to={"/dashboard/active-rider"}>
              <FaUserClock style={{ marginRight: 8 }} />
              Active Rider
            </Link>
          </li>
          <li>
            <Link to={"/dashboard/pending-rider"}>
              <FaUserClock style={{ marginRight: 8 }} />
              Pending Rider
            </Link>
          </li>
        </>
      )}
    </div>,
  ];
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none ">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden">Dash Board</div>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
        {/* Page content here */}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <Logo></Logo>
          {link}
        </ul>
      </div>
    </div>
  );
};

export default DashBoard;
