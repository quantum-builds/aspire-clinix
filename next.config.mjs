/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, PATCH, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/landing",
        destination: "/",
        permanent: true,
      },
      {
        source: "/clinic",
        destination: "/clinic/appointments/upcoming",
        permanent: false,
      },
      {
        source: "/admin",
        destination: "/clinic/appointments/upcoming",
        permanent: false,
      },
      {
        source: "/patient",
        destination: "/patient/appointments/upcoming",
        permanent: false,
      },
      {
        source: "/dentist",
        destination: "/dentist/appointments/upcoming",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aspire-media.s3.eu-west-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
