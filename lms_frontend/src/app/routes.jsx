import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";

const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
];

export default routes;
