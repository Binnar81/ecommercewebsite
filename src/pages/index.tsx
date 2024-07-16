import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ECOMMERCE</h1>
        <p className="mb-8">The next gen business marketplace</p>
        <div className="space-x-4">
          <Link href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Sign Up
          </Link>
          <Link href="/login" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Login
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;