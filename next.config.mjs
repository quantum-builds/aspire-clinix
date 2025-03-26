/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/landing",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
