'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { HeartPulse, ShieldCheck, Bell } from 'lucide-react';
import Link from 'next/link';

// Carousel items from Unsplash
const carouselItems = [
  {
    image:
      'https://images.unsplash.com/photo-1582719471137-c3967ffb1f04?auto=format&fit=crop&w=1400&q=80',
    title: 'Connecting Donors and Patients in Real-Time',
    caption:
      'Every second counts. Our hybrid matching ensures quick and safe blood connections worldwide.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1600959907703-1922a84b2b09?auto=format&fit=crop&w=1400&q=80',
    title: 'Empowering Hospitals with Technology',
    caption:
      'Hospitals can verify donors and manage requests seamlessly within a unified digital ecosystem.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1582719478171-2b0a0a9b8b7f?auto=format&fit=crop&w=1400&q=80',
    title: 'Building a Trusted Donation Community',
    caption:
      'Join thousands of verified donors making a difference through the BloodBound network.',
  },
];

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % carouselItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleManualChange = (newIndex: number) => {
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
        >
          Revolutionizing Blood Donation <br />
          <span className="text-red-500">Through Trust and Tech.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-300 max-w-2xl mb-8"
        >
          Join the next generation of healthcare innovation — where verified donors,
          hospitals, and patients connect seamlessly in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <Link
            href="/auth?tab=register"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300"
          >
            Become a Donor
          </Link>
          <Link
            href="/auth?tab=login"
            className="border border-red-500 hover:bg-red-600/20 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300"
          >
            Request Blood
          </Link>
        </motion.div>
      </section>

      {/* Carousel Section */}
      <section className="relative py-20 border-t border-red-900/30 bg-gradient-to-b from-black to-zinc-900 z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-10">
          {/* Image Carousel */}
          <div className="relative w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-2xl border border-red-900/50 shadow-lg shadow-red-900/40 glow-red">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={carouselItems[index].image}
                src={carouselItems[index].image}
                alt={carouselItems[index].title}
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full object-cover rounded-2xl border border-red-800/70"
              />
            </AnimatePresence>

            <div className="absolute inset-0 rounded-2xl border border-red-700/30 animate-pulse" />
          </div>

          {/* Caption / Side Text */}
          <div className="md:w-1/2 space-y-4">
            <motion.h3
              key={carouselItems[index].title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-red-400"
            >
              {carouselItems[index].title}
            </motion.h3>

            <motion.p
              key={carouselItems[index].caption}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-gray-300 leading-relaxed"
            >
              {carouselItems[index].caption}
            </motion.p>

            <div className="flex gap-3 mt-6">
              {carouselItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleManualChange(i)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    i === index
                      ? 'bg-red-500 scale-125'
                      : 'bg-gray-600 hover:bg-red-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-red-900/30 bg-black relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400">
          <p>© {new Date().getFullYear()} BloodBound — Built with ❤️ by Team MantaHQ</p>
          <div className="flex gap-5">
            <Link href="https://twitter.com" target="_blank" className="hover:text-red-500">
              <i className="fa-brands fa-x-twitter text-lg" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-red-500">
              <i className="fa-brands fa-linkedin-in text-lg" />
            </Link>
            <Link href="https://github.com" target="_blank" className="hover:text-red-500">
              <i className="fa-brands fa-github text-lg" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
