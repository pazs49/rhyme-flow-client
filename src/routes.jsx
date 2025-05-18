import LandingPage from "./pages/LandingPage";
import SidebarDemo from "./components/sidebar-demo-2";

import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    // element: <SidebarDemo />,
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
