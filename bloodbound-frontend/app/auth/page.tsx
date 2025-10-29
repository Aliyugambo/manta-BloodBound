'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('Patient');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  // detect query tab
  useEffect(() => {
    if (tab === 'register') setIsLogin(false);
    if (tab === 'login') setIsLogin(true);
  }, [tab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // ---- LOGIN ----
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          { email: form.email, password: form.password },
          { withCredentials: true }
        );

        toast.success('OTP sent! Please verify your email.');

        // store token & role in cookies for middleware use
        Cookies.set('token', data.token, { expires: 7 });
        Cookies.set('role', data.role, { expires: 7 });

        // redirect to email verification step
        setTimeout(() => router.push('/auth/verify-otp'), 1000);
      } else {
        // ---- REGISTER ----
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          username: form.name,
          email: form.email,
          password: form.password,
          role,
        });

        toast.success('Registration successful! Please check your email for OTP.');
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-black blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-zinc-900/80 backdrop-blur-md border border-red-800/50 rounded-2xl shadow-lg shadow-red-900/40 w-[95%] max-w-md p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500 mb-2">🩸 BloodBound</h1>
          <p className="text-gray-400 text-sm italic">
            “Connecting Life Through Blood.”
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 text-sm font-semibold rounded-l-xl transition-all ${
              isLogin
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                : 'bg-transparent border border-red-700 text-gray-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 text-sm font-semibold rounded-r-xl transition-all ${
              !isLogin
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                : 'bg-transparent border border-red-700 text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* ==== LOGIN FORM ==== */}
        {isLogin ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-red-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-red-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Forgot Password Link */}
            <p className="text-right text-sm">
              <a
                href="/auth/forgot-password"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Forgot password?
              </a>
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-3 font-semibold rounded-xl transition-all duration-300 ${
                loading
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/40'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Don’t have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-red-400 hover:text-red-300"
              >
                Register
              </button>
            </p>
          </motion.form>
        ) : (
          /* ==== REGISTER FORM ==== */
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <div>
              <label className="block text-gray-400 text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-red-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-red-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-red-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Select Role</label>
              <div className="flex justify-between bg-black border border-red-800/50 rounded-xl p-2">
                {['Patient', 'Donor', 'Hospital Admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 text-sm font-medium py-2 rounded-lg mx-1 transition-all ${
                      role === r
                        ? 'bg-red-600 text-white shadow-inner shadow-red-900/40'
                        : 'text-gray-400 hover:text-white hover:bg-red-800/30'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-4 font-semibold rounded-xl transition-all duration-300 ${
                loading
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/40'
              }`}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-red-400 hover:text-red-300"
              >
                Login
              </button>
            </p>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}
