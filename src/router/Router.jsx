import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../pages/home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import TrackOrder from "../pages/Track-Order/TrackOrder";
import SendParcel from "../pages/SendParcel.jsx/SendParcel";
import DashBoardLayout from "../Layouts/DashBoardLayout";
import PrivateRoute from "../components/ProtectedRoute/PrivateRoute";
import MyParcels from "../pages/DashBoard/MyOrder/MyParcels";
import Payment from "../pages/DashBoard/PaymentMathod/Payment";
import PaymentHistory from "../pages/DashBoard/PaymentHistory/PaymentHistory";
import TrackParcel from "../pages/DashBoard/TrackParcel/TrackParcel";
import BeARider from "../pages/Rider/BeARider/BeARider";
import PendingRider from "../pages/Rider/PandingRider/PendingRider";
import ActiveRider from "../pages/Rider/AciveRider/ActiveRider";
import MakeAdmin from "../pages/DashBoard/MakeAdmin/MakeAdmin";

import AdminRoute from "../pages/DashBoard/RoleProtected/Admin/AdminRoute";
import Forbidden from "../pages/Forbidden/forbidden";
import AssignRider from "../pages/DashBoard/AssignRider/AssignRider";
import RiderRoute from "../pages/DashBoard/RoleProtected/Rider/RiderRoute";
import PendingDeliveries from "../pages/Rider/PandingParcelRider/PendingDeliveries";
import CompletedDeliveries from "../pages/Rider/CompletedDeliveries/CompletedDeliveries";
import TotalEarnings from "../pages/Rider/TotalEarnings/TotalEarnings";
import CheckRoleDashboard from "../pages/DashBoard/DeshBoardHome/CheckRoleDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/trackOrder",
        Component: TrackOrder,
      },
      {
        path: "forbidden",
        Component: Forbidden,
      },
      {
        path: "/pricing",
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        ),
      },
      {
        path: "/beARider",
        element: (
          <PrivateRoute>
            <BeARider></BeARider>
          </PrivateRoute>
        ),
        loader: () => fetch("/warehouses.json"),
      },
    ],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashBoard",
    element: (
      <PrivateRoute>
        <DashBoardLayout></DashBoardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <CheckRoleDashboard />,
      },
      {
        path: "myParcel",
        element: <MyParcels />,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "pending-rider",
        element: (
          <AdminRoute>
            <PendingRider></PendingRider>
          </AdminRoute>
        ),
      },
      {
        path: "active-rider",
        element: (
          <AdminRoute>
            <ActiveRider></ActiveRider>
          </AdminRoute>
        ),
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "trackParcel",
        Component: TrackParcel,
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoute>
            <MakeAdmin></MakeAdmin>
          </AdminRoute>
        ),
      },
      {
        path: "assignRider",
        element: (
          <AdminRoute>
            <AssignRider></AssignRider>
          </AdminRoute>
        ),
      },

      {
        path: "pendingParcelForRider",
        element: (
          <RiderRoute>
            <PendingDeliveries></PendingDeliveries>
          </RiderRoute>
        ),
      },
      {
        path: "completedDelivery",
        element: (
          <RiderRoute>
            <CompletedDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "totalEarnings",
        element: (
          <RiderRoute>
            <TotalEarnings />
          </RiderRoute>
        ),
      },
    ],
  },
]);

export default router;
