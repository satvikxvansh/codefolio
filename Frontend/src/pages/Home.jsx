import { Outlet } from 'react-router-dom';
import Layout from '@/components/layout.jsx';
import { useLoader } from '@/components/Contexts/loaderContext';
import { Spinner } from '@/components/ui/spinner';
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { div } from 'framer-motion/client';


const Home = () => {
  const { sync } = useLoader();
  return (
    <>
    <AnimatePresence>
      {sync &&
        [
          <motion.div
          key="a"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 h-screen w-full bg-gray-950/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-row bg-gray-800 rounded-full px-3 py-1 gap-2 items-center text-gray-300">
              <Spinner data-icon="inline-start" />
              Sycning
            </div>
          </motion.div>
        ]
      }
    </AnimatePresence>
      <Layout>
        <Outlet />
      </Layout>
    </>
  )
}

export default Home