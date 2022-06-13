import { GetServerSideProps, NextPage } from 'next';
import { Home, PrismaClient } from '@prisma/client';

import Layout from '@/components/Layout';
import Grid from '@/components/Grid';

const prisma = new PrismaClient();

type HomeProps = {
  homes: Home[];
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const homes = await prisma.home.findMany();

  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
};

const Home: NextPage<HomeProps> = ({ homes }) => {
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>Top-rated places to stay</h1>
      <p className='text-gray-500'>Explore some of the best places in the world</p>
      <div className='mt-8'>
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};

export default Home;
