import { Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./Contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner"

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <div className="fixed top-0 h-screen w-full bg-gray-950/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-row bg-gray-800 rounded-full px-3 py-1 gap-2 items-center text-gray-300">
            <Spinner data-icon="inline-start" />
            Authenticating
          </div>
        </div>
      </>
  )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
export default ProtectedRoute;
