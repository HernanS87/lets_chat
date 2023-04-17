import { useAuthContext } from "../context/AuthContext";
import { HashLoader } from "react-spinners";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  return loading ? (
    <div className="min-h-screen bg-slate-800 flex justify-center items-center">
      <HashLoader color={"#36d7b7"} size={100} className="h-screen mx-auto" />
    </div>
  ) : !user ? (
    <Navigate to="/login" />
  ) : (
    <>{ children }</>
  );
};

export default ProtectedRoute;
