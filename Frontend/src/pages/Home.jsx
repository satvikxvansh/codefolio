import { Outlet } from 'react-router-dom';
import Layout from '@/components/layout.jsx';

const Home = () => {
  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  )
}

export default Home