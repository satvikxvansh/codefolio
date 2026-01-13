import { Outlet } from 'react-router-dom';
import Layout from '@/components/layout.jsx';

const Home = () => {
  // const { user } = useAuth();
  return (
    <>
      <Layout>
        {/* <div className='bg-zinc-800 rounded-2xl'> */}
          <Outlet />
        {/* </div> */}
      </Layout>
    </>
  )
}

export default Home