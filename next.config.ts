import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "https://trading.liara.run/api/:path*",
        },

       
        {
          source: "/audioHub/:path*",
          destination: "https://trading.liara.run/audioHub/:path*",
        },
      ];
    }
    
    return [];
  },
};

export default withNextIntl(nextConfig);
