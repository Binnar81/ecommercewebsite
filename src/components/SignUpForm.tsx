import React, { useState } from 'react';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';

const SignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: (data) => {
      router.push(`/verify?userId=${data.userId}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create your account</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
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
      <div className="mb-4">
        <label htmlFor="password" className="block mb-2">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:border-purple-700 border-solid border-4 "
        disabled={signupMutation.isLoading}
      >
        {signupMutation.isLoading ? 'Signing up...' : 'Sign up'}
      </button>
      {signupMutation.isError && (
        <p className="text-red-500 mt-2">{signupMutation.error.message}</p>
      )}
      <p className="mt-4 text-center hover:border-blue-500 border-solid border-2">
        Have an Account? <Link href="/login" className="text-black font-semibold">Login</Link>
      </p>
    </form>
  );
};

export default SignUpForm;