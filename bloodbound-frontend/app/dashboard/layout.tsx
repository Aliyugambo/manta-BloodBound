'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { LogOut, Home, HeartPulse, Hospital, Users, Shield } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = Cookies.get('role');
    setRole(userRole || null);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    router.push('/auth?tab=login');
  };

  const navLinks = [
    { href: '/dashboard/patient', label: 'Patient Dashboard', icon: Home },
    { href: '/dashboard/donor', label: 'Donor Dashboard', icon: HeartPulse },
    { href: '/dashboard/hospital', label: 'Hospital Dashboard', icon: Hospital },
    { href: '/dashboard/admin', label: 'Admin Overview', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900/90 border-r border-red-800/40 p-6 hidden md:flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-8">🩸 BloodBound</h2>
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  pathname === link.href
                    ? 'bg-red-700/60 text-white shadow-md shadow-red-900/40'
                    : 'text-gray-400 hover:text-white hover:bg-red-900/30'
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 px-3 rounded-lg font-semibold shadow-md shadow-red-900/30"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-zinc-900/80 border-b border-red-800/40 p-4 flex justify-between items-center backdrop-blur-md">
          <h1 className="text-lg font-semibold text-red-400">
            {role ? `${role} Dashboard` : 'Dashboard'}
          </h1>
          <p className="text-sm text-gray-400">Welcome back, {role || 'User'}!</p>
        </header>

        {/* Content */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-8 bg-gradient-to-b from-black via-zinc-950 to-zinc-900 overflow-y-auto"
        >
          {children}
        </motion.section>
      </main>
    </div>
  );
}
