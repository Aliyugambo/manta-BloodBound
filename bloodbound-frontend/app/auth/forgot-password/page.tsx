'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        email,
      });

      toast.success('OTP sent to your email. Check your inbox.');
      setTimeout(() => router.push('/auth/reset-password'), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 bg-zinc-900/80 backdrop-blur-md border border-red-800/50 rounded-2xl shadow-lg shadow-red-900/40 w-[90%] max-w-md p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500 mb-2">🩸 BloodBound</h1>
          <p className="text-gray-400 text-sm italic">
            “Connecting Life Through Blood.”
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center text-red-400">
          Forgot Password
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Enter your registered email and we’ll send you a One-Time Password (OTP) to reset
          your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-red-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 ${
              loading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/40'
            }`}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Remembered your password?{' '}
          <button
            onClick={() => router.push('/auth?tab=login')}
            className="text-red-400 hover:text-red-300"
          >
            Go back to Login
          </button>
        </p>
      </motion.div>
    </div>
  );
}
