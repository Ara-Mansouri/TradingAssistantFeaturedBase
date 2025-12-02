// @ts-nocheck
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
})

const createNextIntlPlugin = require("next-intl/plugin")
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/audioHub/:path*",
        destination: "https://trading.liara.run/audioHub/:path*",
      },
    ]
  },
}

module.exports = withNextIntl(withPWA(nextConfig))
