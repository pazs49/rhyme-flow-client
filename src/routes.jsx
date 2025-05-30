import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import { createBrowserRouter, RouterProvider } from "react-router";
import { Error } from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <Error />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
