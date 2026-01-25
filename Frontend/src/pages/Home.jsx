import { Outlet } from 'react-router-dom';
import Layout from '@/components/layout.jsx';
import { useLoader } from '@/components/Contexts/loaderContext';
import { Spinner } from '@/components/ui/spinner';

const Home = () => {
  const { sync } = useLoader();
  return (
    <>
      {sync &&
        <div className="fixed top-0 h-screen w-full bg-gray-950/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-row bg-gray-800 rounded-full px-3 py-1 gap-2 items-center text-gray-300">
            <Spinner data-icon="inline-start" />
            Sycning
          </div>
        </div>
      }
      <Layout>
        <Outlet />
      </Layout>
    </>
  )
}

export default Home