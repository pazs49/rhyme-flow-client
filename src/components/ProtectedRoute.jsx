import { useLocation } from "react-router";

const ProtectedRoute = ({ children }) => {
  // const token = localStorage.getItem("token");
  // const location = useLocation();

  if (true) {
    return children;
  }

  return <div>ProtectedRoute</div>;
};
export default ProtectedRoute;
