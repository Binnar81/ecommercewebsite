import React, { useState } from 'react';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';

const VerifyForm: React.FC = () => {
  const [code, setCode] = useState('');
  const router = useRouter();
  const { userId } = router.query;

  const verifyMutation = trpc.auth.verify.useMutation({
    onSuccess: () => {
      router.push('/login');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof userId === 'string') {
      verifyMutation.mutate({ userId, code });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Verify your email</h2>
      <p className="mb-4">Enter the 6-digit code you have received on your email</p>
      <div className="mb-4">
        <label htmlFor="code" className="block mb-2">Code</label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:border-purple-700 border-solid border-4 "
        disabled={verifyMutation.isLoading}
      >
        {verifyMutation.isLoading ? 'Verifying...' : 'Verify'}
      </button>
      {verifyMutation.isError && (
        <p className="text-red-500 mt-2">{verifyMutation.error.message}</p>
      )}
    </form>
  );
};

export default VerifyForm;