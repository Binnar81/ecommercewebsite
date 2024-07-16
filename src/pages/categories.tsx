import React from 'react';
import Layout from '../components/Layout';
import CategoryList from '../components/CategoryList';
import { getServerSideProps } from '../utils/auth';

const CategoriesPage: React.FC = () => {
  return (
    <Layout>
      <CategoryList />
    </Layout>
  );
};

export { getServerSideProps };
export default CategoriesPage;