import { getInfo } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useCurrentUserInfo from "@/stores/currentUserInfo";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { setActiveUser } = useCurrentUserInfo();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["info"],
    queryFn: async () => {
      const userInfo = await getInfo(localStorage.getItem("token"));
      setActiveUser(userInfo);
      return userInfo;
    },
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });

  if (isLoading) return <Loading />;
  if (isError) {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  }
  // console.log("query data", data);
  if (data) {
    return children;
  }
};
export default ProtectedRoute;
