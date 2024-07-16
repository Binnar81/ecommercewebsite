import React, { useState } from 'react';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      router.push('/categories');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome back to ECOMMERCE</h2>
      <p className="mb-4">The next gen business marketplace</p>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4 relative">
        <label htmlFor="password" className="block mb-2">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-black flex items-center justify-center mt-6 "
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:border-purple-700 border-solid border-4 "
        disabled={loginMutation.isLoading}
      >
        {loginMutation.isLoading ? 'Logging in...' : 'Login'}
      </button>
      <p className="mt-4 text-center hover:border-blue-500 border-solid border-2">
        Don't have an Account? <Link href="/signup" className="text-black font-semibold">Sign up</Link>
      </p>
    </form>
    
  );
};

export default LoginForm;
