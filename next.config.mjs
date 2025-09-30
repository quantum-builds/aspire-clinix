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
      {
        source: "/clinic",
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
