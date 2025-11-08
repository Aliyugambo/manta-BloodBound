/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'supports-color': 'commonjs supports-color',
    });
    return config;
  },
};

export default nextConfig;