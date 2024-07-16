import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';

const Header: React.FC = () => {
  const router = useRouter();
  const { data: user, isLoading } = trpc.auth.getUser.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push('/login');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isAuthPage = router.pathname === '/login' || router.pathname === '/signup' || router.pathname==='/verify';

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-2xl font-bold text-gray-800">
            ECOMMERCE
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <Link href="/help" className="text-gray-600 hover:text-gray-800">Help</Link>
            <Link href="/orders" className="text-gray-600 hover:text-gray-800">Orders & Returns</Link>
            {!isLoading && user && !isAuthPage && (
              <>
                <span className="text-gray-600">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <nav className="flex space-x-4 justify-center flex-grow">
            <Link href="/categories" className="text-black hover:text-blue-600 font-semibold">Categories</Link>
            <Link href="/sale" className="text-black hover:text-blue-600 font-semibold">Sale</Link>
            <Link href="/clearance" className="text-black hover:text-blue-600 font-semibold">Clearance</Link>
            <Link href="/new-stock" className="text-black hover:text-blue-600 font-semibold">New stock</Link>
            <Link href="/trending" className="text-black hover:text-blue-600 font-semibold">Trending</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/cart" className="text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4 flex justify-center items-center space-x-2">
          <button className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="text-gray-600">Get 10% off on business sign up</p>
          <button className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;