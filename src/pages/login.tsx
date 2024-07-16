import React from 'react';
import Layout from '../components/Layout';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <LoginForm />
    </Layout>
  );
};

export default LoginPage;