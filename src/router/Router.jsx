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
        path: "/pricing",
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        ),
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
        path: "my-order",
        element: <MyParcels />,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "payment-history",
        Component:
      },
    ],
  },
]);

export default router;
