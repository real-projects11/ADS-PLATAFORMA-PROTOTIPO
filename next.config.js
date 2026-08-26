/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/', destination: '/index.html' },
      { source: '/login', destination: '/login.html' },
      { source: '/register', destination: '/register.html' },
      { source: '/dashboard', destination: '/dashboard.html' },
    ];
  },
};
module.exports = nextConfig;
