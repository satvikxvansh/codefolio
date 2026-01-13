import { Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const {user, loading} = useAuth();

  if(loading) {
    return (
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-xs overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div className="relative p-8 bg-white w-full max-w-md m-auto rounded-xl shadow-2xl border border-gray-200">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
export default ProtectedRoute;
