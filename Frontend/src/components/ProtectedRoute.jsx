import { Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./Contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner"
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        {/* Children always render in background */}
        {/* {children} */}

        {/* Overlay floats on top */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="fixed inset-0 flex items-center backdrop-blur-sm bg-black/20 justify-center z-50"
            >
              <div className="flex flex-row bg-gray-800 rounded-full px-3 py-1 gap-2 items-center text-gray-300">
                <Spinner />
                Authenticating
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
export default ProtectedRoute;
