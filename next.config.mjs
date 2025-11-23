/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "d1csarkz8obe9u.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
