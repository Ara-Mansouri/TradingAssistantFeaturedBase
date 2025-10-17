/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://trading.liara.run/api/:path*", 
      },
    ];
  },
};

module.exports = nextConfig;
